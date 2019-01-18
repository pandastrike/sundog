# Sundog
# Base is a super thin wrapper around the AWS SDK, lifting each service module so you may use them with promises rather than callbacks.
# Primatives is a slightly higher level wrapper - still promise based - to give the SDK a more functional flavor.

import Base from "./lift-all"
import Primatives from "./primitives"
import Helpers from "./helpers"

start = (engine) ->
  Object.defineProperties {},
    _AWS:
      enumerable: true
      get: -> Base engine
    AWS:
      enumerable: true
      get: -> Primatives @_AWS

export default start
export {Helpers}
