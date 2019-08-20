import {first, sleep, cat, empty} from "panda-parchment"
import {collect} from "panda-river"
import {where} from "./private-utils"
import {prepareModule} from "../lift"

cloudformationPrimitive = (options) ->
  (configuration) ->
    cf = prepareModule options, configuration,
      require("aws-sdk/clients/cloudformation"),
      [
        "describeStacks"
        "createStack"
        "updateStack"
        "deleteStack"
        "listStacks"
      ]

    get = (StackName) ->
      try
        first (await cf.describeStacks({StackName})).Stacks
      catch
        false

    outputs = (name) ->
      if stack = await get name
        stack.Outputs
      else
        throw new Error "unable to find stack #{name}"

    output = (OutputKey, stack) ->
      results = collect where {OutputKey}, await outputs stack
      if empty results
        throw new Error "Unable to find output #{OutputKey} on stack #{stack}"
      else
        (first results).OutputValue

    # Confirm the stack is viable and online.
    publishWait = (name) ->
      while true
        {StackStatus, StackStatusReason} = await get name
        switch StackStatus
          when "CREATE_IN_PROGRESS", "UPDATE_IN_PROGRESS", "UPDATE_COMPLETE_CLEANUP_IN_PROGRESS"
            await sleep 5000
          when "CREATE_COMPLETE", "UPDATE_COMPLETE"
            return true
          else
            throw new Error """
            Stack creation failed. #{StackStatus} #{StackStatusReason}
            """

    # Confirm the stack is fully and properly deleted.
    deleteWait = (name) ->
      while true
        {StackStatus, StackStatusReason} = await get name
        return true if !StackStatus
        switch StackStatus
          when "DELETE_IN_PROGRESS"
            await sleep 5000
          when "DELETE_COMPLETE"
            return true
          else
            throw new Error """
            Stack deletion failed. #{StackStatus} #{StackStatusReason}
            """

    create = (stack) ->
      await cf.createStack stack
      await publishWait stack.StackName

    update = (stack) ->
      await cf.updateStack stack
      await publishWait stack.StackName

    _put = (stack) ->
      try
        await update stack
      catch e
        throw e unless (e.name == "ValidationError") && (e.message == "No updates are to be performed.")

    put = (stack) ->
      if await get stack.StackName
        await _put stack
      else
        await create stack

    destroy = (StackName) ->
      return if !(await get StackName)
      await cf.deleteStack {StackName}
      await deleteWait StackName

    list = (current=[], token) ->
      params = StackStatusFilter: validStatuses
      params.NextToken = token if token

      {NextToken, StackSummaries} = await cf.listStacks params
      if NextToken
        await list cat(current, StackSummaries), NextToken
      else
        cat current, StackSummaries

    validStatuses = [ "CREATE_IN_PROGRESS", "CREATE_COMPLETE", "ROLLBACK_IN_PROGRESS", "ROLLBACK_FAILED", "ROLLBACK_COMPLETE", "DELETE_IN_PROGRESS", "UPDATE_IN_PROGRESS", "UPDATE_COMPLETE_CLEANUP_IN_PROGRESS", "UPDATE_COMPLETE", "UPDATE_ROLLBACK_IN_PROGRESS", "UPDATE_ROLLBACK_FAILED", "UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS", "UPDATE_ROLLBACK_COMPLETE"]


    {
      get
      outputs
      output
      publishWait
      deleteWait
      create
      update
      put
      delete: destroy
      list
      validStatuses
    }

export default cloudformationPrimitive
