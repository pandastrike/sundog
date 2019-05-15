# Primitives for the service StepFunctions.
import {toJSON, merge, cat} from "panda-parchment"
import {applyConfiguration} from "../lift"

stepPrimitive = (SDK) ->
  (configuration) ->
    step = applyConfiguration configuration, SDK.StepFunctions

    start = (arn, input, name) ->
      step.startExecution
        stateMachineArn: arn
        input: if input then toJSON input else undefined
        name: name

    stop = (arn, options) ->
      step.stopExecution merge {executionArn: arn}, options

    listExes = (arn, status, current=[], next) ->
      {nextToken, executions} = await step.listExecutions {
        stateMachineArn: arn
        statusFilter: status
        maxResults: 1000
        nextToken: next
      }

      current = cat current, executions
      if nextToken
        listExes arn, status, current, nextToken
      else
        current


    list = (current=[], next) ->
      {nextToken, stateMachines} = await step.listStateMachines
        maxResults: 1000
        nextToken: next

      current = cat current, stateMachines
      if nextToken
        list current, nextToken
      else
        current

    lookup = (name) ->
      machines = await list()
      for machine in machines
        return machine if machine.name == name

      false

    stopAll = (name) ->
      {stateMachineArn} = await lookup name
      expressions = await listExes stateMachineArn, "RUNNING"
      for {executionArn} in expressions
        await stop executionArn


    {start, stop, list, lookup, listExes, stopAll}


export default stepPrimitive
