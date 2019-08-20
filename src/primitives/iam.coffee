import {cat, merge, toJSON} from "panda-parchment"
import {prepareModule} from "../lift"

iamPrimitive = (options) ->
  (configuration) ->
    iam = prepareModule options, configuration,
      require("aws-sdk/clients/iam"),
      [
        "getRole"
        "createRole"
        "attachRolePolicy"
        "detachRolePolicy"
        "deleteRole"
      ]

    role =
      get: (RoleName) ->
        try
          await iam.getRole {RoleName}
        catch
          false

      create: (params) -> await iam.createRole params

      attachPolicy: (RoleName, PolicyArn) ->
        await iam.attachRolePolicy {RoleName, PolicyArn}

      detachPolicy: (RoleName, PolicyArn) ->
        await iam.detachRolePolicy {RoleName, PolicyArn}

      delete: (RoleName) ->
        await iam.deleteRole {RoleName}


    {role}


export default iamPrimitive
