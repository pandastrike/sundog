# Primitives for the service SNS (simple notificaiton service).

snsPrimative = (_AWS) ->
  sns = _AWS.SNS

  sendSMS = (PhoneNumber, Message) ->
    await sns.publish {PhoneNumber, Message}

  {sendSMS}

export default snsPrimative
