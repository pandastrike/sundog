import Engine from "./engine"
import _AWS from "./lifted"
import AWS from "./primitives"
import Helpers from "./helpers"

start = (region) ->
  engine = Engine region
  _AWS = _AWS engine
  # AWS = AWS _AWS
  # Helpers = Helpers _AWS

  #{_AWS, AWS, Helpers}
  {_AWS}

export default start
