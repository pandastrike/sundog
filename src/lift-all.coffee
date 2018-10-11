import {isFunction, merge} from "panda-parchment"
import {liftService} from "./lift"

avoidedServices = ["CloudSearchDomain", "IotData"]

liftAll = (AWS) ->
  services = {}
  for k, v of AWS
    if (isFunction v) && v.__super__?.name == "Service" && (k not in avoidedServices)
      services[k] = liftService new v()
  services

_AWS = (AWS) -> merge {SDK: AWS}, liftAll AWS

export default _AWS
