import {isFunction, lift, bind} from "fairmont"

avoidedServices = ["CloudSearchDomain", "IotData"]

liftService = (s) ->
  service = {}
  for k, v of s
    service[k] = if isFunction v then lift bind v, s else v
  service

liftAll = (AWS) ->
  services = {}
  for k, v of AWS when (isFunction v) && v.__super__?.name == "Service"
    services[k] = liftService new v() if k not in avoidedServices
  services

_AWS = (AWS) -> liftAll AWS

export default _AWS
