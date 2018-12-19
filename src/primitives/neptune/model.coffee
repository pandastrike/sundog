#import {applyConfiguration} from "../lift"
import {curry} from "panda-garden"
import {upsert as _upsert, range as _range} from "./helpers"


Model = (definition) ->
  range = _range definition.pageSize
  upsert = _upsert definition.allowedProperties

  {range, upsert}


export default {Model}
