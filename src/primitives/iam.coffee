import {cat, merge, toJSON} from "panda-parchment"
import {applyConfiguration} from "../lift"

iamPrimitive = (SDK) ->
  (configuration) ->
    iam = applyConfiguration configuration, SDK.IAM

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
