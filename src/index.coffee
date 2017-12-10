import Engine from "./engine"
import Pillar1 from "./lifted"
import Pillar2 from "./primitives"
import Pillar3 from "./helpers"

start = (region) ->
  engine = await Engine region
  _AWS = Pillar1 engine
  AWS = Pillar2 _AWS
  Helpers = Pillar3 AWS

  {_AWS, AWS, Helpers}

export default start
