import {include} from "panda-parchment"
import {applyConfiguration} from "../../lift"
import Base from "./base"
import OriginAccess from "./origin-access"

cloudfrontPrimitive = (SDK) ->
  (configuration) ->
    cf = applyConfiguration configuration, SDK.CloudFront

    output = {}
    include output, Base cf
    include output, OriginAccess cf
    output

export default cloudfrontPrimitive
