# Some SunDog methods return false when a resource cannot be found instead
# of throwing the raw AWS error.  In custom cases, that's not always 404.
notFound = (e, status=404, code) ->
  if e?.statusCode == status
    throw e if code && e.code != code
    false
  else
    throw e

export {notFound}
