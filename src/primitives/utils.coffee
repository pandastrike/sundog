notFound = (e) -> if e.statusCode == 404 then false else throw e

export {notFound}
