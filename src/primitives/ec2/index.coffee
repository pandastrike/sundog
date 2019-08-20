import ENI from "./eni"
import VPC from "./vpc"

EC2 = (options) ->
  (configuration) ->
    ec2 = prepareModule options, configuration,
      require("aws-sdk/clients/ec2"),
      [
        "describeNetworkInterfaces"
        "detachNetworkInterface"
        "deleteNetworkInterface"
        "describeVpcEndpoints"
      ]

    ENI: ENI ec2
    VPC: VPC ec2

export default EC2
