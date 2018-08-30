import {isFunction} from "fairmont"
import {liftService} from "./base"

avoidedServices = ["CloudSearchDomain", "IotData"]

liftAll = (AWS) ->
  services = {}
  for k, v of AWS
    if (isFunction v) && v.__super__?.name == "Service" && (k not in avoidedServices)

      if k == "S3"
        services[k] = liftService new v signatureVersion: 'v4'
      else
        services[k] = liftService new v()
  services

_AWS = (AWS) -> liftAll AWS

export default _AWS
