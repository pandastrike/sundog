# Primitives for the service CloudWatch Logs.  The main entities are groups and streams.
# This follows the naming convention that methods that work on groups will be
# prefixed "group*", whereas streams methods will have no prefix.

import {cat, empty} from "panda-parchment"
import {prepareModule} from "../lift"

cloudwatchPrimitive = (options) ->
  (configuration) ->
    logs = prepareModule options, configuration,
      require("aws-sdk/clients/cloudwatchlogs"),
      [
        "describeLogGroups"
        "describeLogStreams"
        "getLogEvents"
        "createLogGroup"
      ]

    # Returns data on a group or groups given an input prefix.
    groupList = (prefix, current=[], token) ->
      params = logGroupNamePrefix: prefix
      params.nextToken = token if token
      {logGroups, nextToken} = await logs.describeLogGroups params
      current = cat current, logGroups
      if nextToken
        await groupList prefix, current, nextToken
      else
        current

    latest = (name) ->
      params =
        logGroupName: name
        orderBy: "LastEventTime"
        descending: true
        limit: 1

      {logStreams} = await logs.describeLogStreams params
      if empty logStreams
        undefined
      else
        logStreams[0]

    tail = (group, stream, time, current=[], token=false) ->
      params =
        logGroupName: group
        logStreamName: stream
        startTime: time
        startFromHead: true
      params.nextToken = token if token

      {events, nextForwardToken} = await logs.getLogEvents params
      current = cat current, events
      if nextForwardToken != token
        await tail group, stream, time, current, nextForwardToken
      else
        current

    exists = (name) ->
      {logGroups} = await logs.describeLogGroups
        limit: 1
        logGroupNamePrefix: name

      if empty logGroups
        false
      else
        true

    create = (name) ->
      await logs.createLogGroup logGroupName: name

    # Return exposed functions.
    {groupList, latest, tail, exists, create}

export default cloudwatchPrimitive
