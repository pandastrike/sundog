# Primitives for the service S3  The main entities are buckets and objects.
# This follows the naming convention that methods that work on buckets will be
# prefixed "bucket*", whereas object methods will have no prefix.
import {include} from "panda-parchment"
import Objects from "./object"
import Buckets from "./bucket"
import {prepareModule} from "../../lift"

s3Primitive = (options) ->
  (configuration) ->
    s3 = prepareModule options, configuration,
      require("aws-sdk/clients/s3"),
      [
        "headBucket"
        "createBucket"
        "putBucketAcl"
        "putBucketCors"
        "putBucketWebsite"
        "putBucketPolicy"
        "deleteBucket"

        "headObject"
        "getObject"
        "deleteObject"
        "deleteObjects"
        "listObjectsV2"

        "putObject"

        "createMultipartUpload"
        "abortMultipartUpload"
        "completeMultipartUpload"
        "uploadPart"

        "getSignedUrl"
        "createPresignedPost"
      ]

    output = {}
    include output, Objects s3
    include output, Buckets s3, output
    output

export default s3Primitive
