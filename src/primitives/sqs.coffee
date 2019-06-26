# Primitives for the service SNS (simple notificaiton service).
import {applyConfiguration} from "../lift"
import {include, isString, isArray, isObject} from "panda-parchment"

sqsPrimitive = (SDK) ->
  (configuration) ->
    sqs = applyConfiguration configuration, SDK.SQS

    getURL = (name) ->
      {QueueUrl} = await sqs.getQueueUrl QueueName: name
      QueueUrl

    create = (name, options) ->
      await sqs.createQueue
        QueueName: name
        Attributes: options

    createLongPoll = (name, options={}) ->
      defaults =
        ReceiveMessageWaitTimeSeconds: "20"
        FifoQueue: "true"
        ContentBasedDeduplication: "true"

      await create name, include defaults, options

    # AWS API docs recommend waiting 60s for delete to complete.
    del = (url) -> await sqs.deleteQueue QueueUrl: url

    # AWS API docs recommend waiting 60s for purge to complete.
    purge = (url) -> await sqs.purgeQueue QueueUrl: url

    add = (url, message, options={}) ->
      if isString message
        await sqs.sendMessage include options,
          MessageBody: message
          QueueUrl: url
      else if isArray message
        await sqs.sendMessageBatch
          QueueUrl: url
          Entries:
            for m, i in message
              if isString m
                merge Id: "#{i}", MessageBody: m, options
              else if isArray m
                merge Id: "#{i}", MessageBody: m[0], options, m[1]
              else
                throw new Error "unknown message in batch #{m}"
      else
        throw new Error "unknown message type #{message}"

    addFIFO = (url, message, options={}) ->
      options.MessageGroupId ?= "DefaultMessageGroupID"
      await add url, message, options

    read = (url, options) ->
      defaults =
        QueueUrl: url
        AttributeNames: ["All"]
        MessageAttributeNames: ["All"]

      {Messages} = await sqs.receiveMessage include defaults, options
      Messages

    remove = (url, handle) ->
      if isString handle
        await sqs.deleteMessage
          QueueUrl: url
          ReceiptHandle: handle
      else if isArray handle
        await sqs.deleteMessageBatch
          QueueUrl: url
          Entries: Id: "#{i}", ReceiptHandle: h for h, i in handle
      else
        throw new Error "unknown reciept handler type #{handle}"


    {getURL, create, createLongPoll, del, purge, add, addFIFO, read, remove}

export default sqsPrimitive
