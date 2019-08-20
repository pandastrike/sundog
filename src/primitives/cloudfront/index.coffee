import {include} from "panda-parchment"
import {prepareModule} from "../../lift"
import Base from "./base"
import OriginAccess from "./origin-access"

cloudfrontPrimitive = (options) ->
  (configuration) ->
    cf = prepareModule options, configuration,
      require("aws-sdk/clients/cloudfront"),
      [
        "listDistributions"
        "getDistribution"
        "createInvalidation"
        "getInvalidation"
        "listCloudFrontOriginAccessIdentities"
        "createCloudFrontOriginAccessIdentity"
        "getCloudFrontOriginAccessIdentity"
        "deleteCloudFrontOriginAccessIdentity"
      ]

    output = {}
    include output, Base cf
    include output, OriginAccess cf
    output

export default cloudfrontPrimitive
