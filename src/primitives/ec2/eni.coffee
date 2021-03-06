import {sleep, first} from "panda-parchment"
import {collect, select, project} from "panda-river"
import {where} from "../private-utils"

eniPrimitive = (ec2) ->
  list = (subnetIDs) ->
    {NetworkInterfaces} = await ec2.describeNetworkInterfaces
      Filters: [
        Name: "subnet-id"
        Values: subnetIDs
      ]
    NetworkInterfaces

  get = (id) ->
    try
      {NetworkInterfaces} = await ec2.describeNetworkInterfaces
        NetworkInterfaceIds: [ id ]
      first NetworkInterfaces
    catch e
      false

  waitFor = (status) ->
    (id) ->
      while true
        await sleep 10000
        subnet = await get id
        if subnet.Status == status
          return

  waitForAvailable = waitFor "available"
  waitForInUse = waitFor "in-use"

  detach = (id, attachmentID) ->
    await ec2.detachNetworkInterface
      AttachmentId: attachmentID
      Force: true

    await waitForAvailable id

  Delete = (id) ->
    await ec2.deleteNetworkInterface
      NetworkInterfaceId: id

  purge = (subnetIDs, test) ->
    # Collect any ENIs that meet your test specs.
    ENIs = await list subnetIDs
    ENIs = collect select test, ENIs

    # Detach any attached ENIs
    attachedENIs = collect where Status: "in-use", ENIs
    await Promise.all (detach e.NetworkInterfaceId, e.Attachment.AttachmentId for e in attachedENIs)

    # Destroy all the ENIs
    await Promise.all (Delete e.NetworkInterfaceId for e in ENIs)


  {purge}

export default eniPrimitive
