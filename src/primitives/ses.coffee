# Primitives for the service SES (simple email service).
import {isObject, isArray, merge} from "fairmont"

sesPrimitive = (_AWS) ->
  ses = _AWS.SES

  sendEmail = (src, dest, subject, body, format="text", opts={}) ->
    Source = src
    if isArray dest
      Destination = ToAddresses: dest
    else if isObject dest
      Destination = dest
    else
      Destination = ToAddresses: [dest]

    Subject = Data: subject
    if format == "text"
      Body = Text: Data: body
    else if format == "html"
      Body = Html: Data: body
    else
      throw new Error "Unknown body format"

    params = {
      Source
      Destination
      Message: {Subject, Body}
    }

    params = merge params, opts
    await ses.sendEmail params

  {sendEmail}


export default sesPrimitive
