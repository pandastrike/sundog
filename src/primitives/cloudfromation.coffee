import {first, sleep, cat, collect, select, where} from "fairmont"

cloudformationPrimitive = (_AWS) ->
  cfo = _AWS.CloudFormation

  get = (StackName) ->
    try
      first (await cfo.describeStacks({StackName})).Stacks
    catch
      false

  output = (OutputKey, StackName) ->
    data = await cfo.describeStacks {StackName}
    outputs = collect where {OutputKey}, data.Stacks[0].Outputs
    outputs[0].OutputValue

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
    await cfo.createStack template
    await publishWait stack.StackName

  update = (stack) ->
    await cfo.updateStack stack
    await publishWait stack.StackName

  destroy = (StackName) ->
    return if !(await get StackName)
    await cfo.deleteStack {StackName}
    await deleteWait StackName


  {
    get
    output
    publishWait
    deleteWait
    create
    update
    delete: destroy
  }

export default cloudformationPrimitive
