# Primitives for the service S3.  The main entities are buckets and objects.
# This follows the naming convention that methods that work on buckets will be
# prefixed "bucket*", whereas object methods will have no prefix.
import {include} from "panda-parchment"
import Objects from "./object"
import Buckets from "./bucket"
import {applyConfiguration} from "../../lift"

s3Primitive = (SDK) ->
  (configuration) ->
    s3 = applyConfiguration configuration, SDK.S3

    output = {}
    include output, Objects s3
    include output, Buckets s3, output
    output

export default s3Primitive
