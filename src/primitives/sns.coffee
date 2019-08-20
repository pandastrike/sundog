# Primitives for the service SNS (simple notificaiton service).
import {prepareModule} from "../lift"

snsPrimitive = (options) ->
  (configuration) ->
    sns = prepareModule options, configuration,
      require("aws-sdk/clients/sns"),
      [
        "publish"
      ]

    sendSMS = (PhoneNumber, Message) ->
      await sns.publish {PhoneNumber, Message}

    {sendSMS}

export default snsPrimitive
