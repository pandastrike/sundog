import {curry} from "panda-garden"
import {query} from "panda-parchment"
import {select} from "panda-river"


# Some SunDog methods return false when a resource cannot be found instead
# of throwing the raw AWS error.  In custom cases, that's not always 404.
notFound = (e, status=404, code) ->
  if e?.statusCode == status
    throw e if code && e.code != code
    false
  else
    throw e

where = curry (example, i) -> select (query example), i

export {notFound, where}
