# Primitives for the service Cognito.  The base entity is the "user".  Methods that act on other entities, like pools or clients are prefixed as such.
import {prepareModule} from "../lift"

stsPrimitive = (options) ->
  (configuration) ->
    sts = prepareModule options, configuration,
      require("aws-sdk/clients/sts"),
      [
        "getCallerIdentity"
      ]

    whoAmI = -> await sts.getCallerIdentity()

    {whoAmI}

export default stsPrimitive
