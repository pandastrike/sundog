import {isFunction, rephrase as lift, bind} from "panda-parchment"

liftService = (s) ->
  service = {}
  for k, v of s
    service[k] = if isFunction v then lift bind v, s else v
  service

applyConfiguration = (configuration, service) ->
  if configuration
    liftService new service configuration
  else
    liftService new service()

export {liftService, applyConfiguration}
