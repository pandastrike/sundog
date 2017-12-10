
# {async, read, isFunction, where, lift} = require "fairmont"
# {task} = require "panda-9000"
#
# # this should be in f-core
# bind = (o, f) -> f.bind o
#
# liftModule = (m) ->
#   lifted = {}
#   for k, v of m
#     lifted[k] = if isFunction v then (lift v.bind m) else v
#   lifted
#
# # Module's we'd like to invoke from AWS are listed and lifted here.
# acm = liftModule new AWS.ACM()
# agw = liftModule new AWS.APIGateway()
# gw = liftModule new AWS.APIGateway()
# cfo = liftModule new AWS.CloudFormation()
# cfr = liftModule new AWS.CloudFront()
# lambda = liftModule new AWS.Lambda()
# route53 = liftModule new AWS.Route53()
# s3 = liftModule new AWS.S3()
#
# {acm, agw, gw, cfo, cfr, lambda, route53, s3}

_AWS = (engine) ->
  console.log engine




export default _AWS
