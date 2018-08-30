import {isFunction, lift, bind} from "fairmont"

input = (SDK) ->
  liftService = (s) ->
    service = {}
    for k, v of s
      service[k] = if isFunction v then lift bind v, s else v
    service

  {SDK, liftService}

export default input
