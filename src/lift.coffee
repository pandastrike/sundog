import {isFunction, bind} from "panda-parchment"

promise = (f) -> new Promise f

callback = (resolve, reject) -> [
    (error, args...) ->
      if error then (reject error) else (resolve args...)
  ]

lift = (f) ->
  (args...) ->
      promise (resolve, reject) ->
        try
          f args..., (callback resolve, reject)...
        catch error
          reject error

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
