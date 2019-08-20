# Primitives for the service Cognito.  The base entity is the "user".  Methods that act on other entities, like pools or clients are prefixed as such.

import {cat} from "panda-parchment"
import {collect} from "panda-river"
import {where} from "./private-utils"
import {prepareModule} from "../lift"

cognitoPrimitive = (options) ->
  (configuration) ->
    cog = prepareModule options, configuration,
      require("aws-sdk/clients/cognitoidentityserviceprovider"),
      [
        "listUserPools"
        "describeUserPool"
        "listUserPoolClients"
        "describeUserPoolClient"
      ]


  poolList = (current=[], token) ->
    params = MaxResults: 60
    params.NextToken = token if token
    {UserPools, NextToken} = await cog.listUserPools params
    current = cat current, UserPools
    if NextToken
      await poolList current, NextToken
    else
      current

  poolHead = (name) ->
    [pool] = collect where Name: name, await poolList()
    if pool then pool else false

  poolGet = (name) ->
    {Id} = await poolHead name
    if !Id
      return false
    else
      {UserPool} = await cog.describeUserPool UserPoolId: Id
      UserPool

  clientList = (UserPoolId, current=[], token) ->
    params = {
      UserPoolId
      MaxResults: 60
    }
    params.NextToken = token if token
    {UserPoolClients, NextToken} = await cog.listUserPoolClients params
    current = cat current, UserPoolClients
    if NextToken
      await clientList UserPoolId, current, NextToken
    else
      current

  clientHead = (UserPoolOverload, ClientName) ->
    if ClientName
      Id = UserPoolOverload
    else
      ClientName = UserPoolName = UserPoolOverload
      {Id} = await poolHead UserPoolName

    if !Id
      return false
    else
      [client] = collect where {ClientName}, await clientList(Id)
      if client then client else false

  clientGet = (userPoolName, clientName) ->
    clientName ||= userPoolName
    {UserPoolId, ClientId} = await clientHead userPoolName, clientName
    if ClientId
      {UserPoolClient} = await cog.describeUserPoolClient {UserPoolId, ClientId}
      UserPoolClient
    else
      false


  {poolList, poolHead, poolGet, clientList, clientHead, clientGet}


export default cognitoPrimitive
