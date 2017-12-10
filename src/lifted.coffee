import {isFunction, lift, bind} from "fairmont"

liftService = (s) ->
  service = {}
  for k, v of s
    service[k] = if isFunction v then lift bind v, s else v
  service

liftAll = (AWS) ->
  services = {}
  for k, v of AWS
    if isFunction v && v.__super__
      if v.__super__.name == "Service"
        services[k] = liftService v
  services

_AWS = (AWS) -> liftAll AWS

export default _AWS
