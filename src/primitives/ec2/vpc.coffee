import {applyConfiguration} from "../../lift"

vpcPrimitive = (SDK) ->
  (configuration) ->
    ec2 = applyConfiguration configuration, SDK.EC2

    getServiceEndpoints = (vpcID, serviceName) ->
      {VpcEndpoints} = await ec2.describeVpcEndpoints
        Filters: [
          Name: "vpc-id"
          Values: [vpcID]
        ,
          Name: "service-name"
          Values: [serviceName]
        ]

      VpcEndpoints

    {getServiceEndpoints}

export default vpcPrimitive
