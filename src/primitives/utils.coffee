utils = ->
  notFound = (e) ->
    if e.statusCode == 404
      false
    else
      throw e

  {notFound}

export default utils
