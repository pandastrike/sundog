#import Engine from "./engine"
import Pillar1 from "./lifted"
import Pillar2 from "./primitives"
import Pillar3 from "./helpers"

start = (engine) ->
  Object.defineProperties {},
    _AWS:
      enumerable: true
      get: -> Pillar1 engine
    AWS:
      enumerable: true
      get: -> Pillar2 @_AWS
    Helpers:
      enumerable: true
      get: -> Pillar3 @AWS

export default start
