import ENI from "./eni"
import VPC from "./vpc"

EC2 = (SDK) ->
  ENI: ENI SDK
  VPC: VPC SDK

export default EC2
