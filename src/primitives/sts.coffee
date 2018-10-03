# Primitives for the service Cognito.  The base entity is the "user".  Methods that act on other entities, like pools or clients are prefixed as such.
import {applyConfiguration} from "../lift"

stsPrimitive = (SDK) ->
  (configuration) ->
    sts = applyConfiguration configuration, SDK.STS

    whoAmI = -> await sts.getCallerIdentity()

    {whoAmI}

export default stsPrimitive
