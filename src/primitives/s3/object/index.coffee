# Primitives for the service S3.  The main entities are buckets and objects.
# This follows the naming convention that methods that work on buckets will be
# prefixed "bucket*", whereas object methods will have no prefix.

import {include} from "panda-parchment"
import Base from "./base"
import Put from "./put"
import ACL from "./acl"
import Multipart from "./multipart"
import Sign from "./signature"

Section = (s3) ->

  output = {}
  include output, Base s3
  include output, Put s3, output
  include output, ACL s3, output
  include output, Multipart s3, output
  include output, Sign s3, output
  output

export default Section
