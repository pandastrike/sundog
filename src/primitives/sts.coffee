# Primitives for the service Cognito.  The base entity is the "user".  Methods that act on other entities, like pools or clients are prefixed as such.

stsPrimitive = (_AWS) ->
  sts = _AWS.STS

  whoAmI = -> await sts.getCallerIdentity()

  {whoAmI}

export default stsPrimitive
