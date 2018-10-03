# Primitives for the service SNS (simple notificaiton service).
import {applyConfiguration} from "../lift"

snsPrimitive = (SDK) ->
  (configuration) ->
    sns = applyConfiguration configuration, SDK.SNS

    sendSMS = (PhoneNumber, Message) ->
      await sns.publish {PhoneNumber, Message}

    {sendSMS}

export default snsPrimitive
