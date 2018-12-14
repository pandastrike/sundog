#import {applyConfiguration} from "../lift"
import {curry} from "panda-garden"

# Enforce the data model via an allowlist of fields.
upsert = curry (allowedProperties, data) ->
  query = ""
  for name, value of data when name in allowedProperties
    query += ".property('#{name}', '#{value}')"
  query

range = curry (pageSize, page) ->
  start = pageSize * page
  end = pageSize * (page + 1)
  "range(#{start}, #{end})"

getID = curry (name, data) -> data[name]

export default {upsert, range, getID}
export {upsert, range, getID}
