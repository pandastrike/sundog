#import {applyConfiguration} from "../lift"
import {curry} from "panda-garden"
import {merge} from "panda-parchment"
import {upsert:_upsert, range:_range, getID:_getID} from "./helpers"


Model = (definition) ->
  range = _range definition.pageSize
  upsert = _upsert definition.allowedProperties
  NAME = definition.name

  {range, upsert}


export default Model
