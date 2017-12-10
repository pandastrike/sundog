utils = do ->
  notFound = (e) -> if e.statusCode == 404 then false else throw e

  {notFound}

export default utils
