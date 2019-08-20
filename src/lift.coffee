import {merge, isFunction, bind} from "panda-parchment"

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

prepareModule = (options={}, configuration={}, service, methodList) ->
  instance = new service merge options, configuration

  for name in methodList
    try
      instance[name] = lift bind instance[name], instance
    catch e
      console.error "Sundog lift failure #{instance.constructor.name} #{name}"
      console.error e
      throw new Error()

  instance

export {lift, liftService, prepareModule}
