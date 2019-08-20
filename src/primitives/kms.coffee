# Primitives for the service KMS.
# NOTE: In KMS methods besides "create" and "delete" and "addAlias": ID can be key ID, key ARN, or key alias name.

import {cat, merge} from "panda-parchment"
import {notFound} from "./private-utils"
import {prepareModule} from "../lift"

cognitoPrimitive = (options) ->
  (configuration) ->
    kms = prepareModule options, configuration,
      require("aws-sdk/clients/kms"),
      [
        "describeKey"
        "createKey"
        "scheduleKeyDeletion"
        "createAlias"
        "deleteAlias"
        "generateRandom"
        "encrypt"
        "decrypt"
        "reEncrypt"
      ]

    get = (id, tokens) ->
      try
        params = {KeyId: id}
        params.GrantTokens = tokens if tokens
        {KeyMetadata} = await kms.describeKey params
        KeyMetadata
      catch e
        notFound e, 400, "NotFoundException"

    create = (params={}) ->
      {KeyMetadata} = await kms.createKey params
      KeyMetadata

    scheduleDelete = (id, delay) ->
      params = KeyId: id
      params.PendingWindowInDays = delay if delay
      await kms.scheduleKeyDeletion params

    addAlias = (TargetKeyId, AliasName) ->
      await kms.createAlias {TargetKeyId, AliasName}

    removeAlias = (AliasName) ->
      await kms.deleteAlias {AliasName}

    randomBytes = (size) ->
      {Plaintext} = await kms.generateRandom {NumberOfBytes: size}
      new Uint8Array Plaintext

    encrypt = (id, plaintext, encoding="utf8", options={}) ->
      switch encoding
        when "utf8", "base64", "hex", "ascii", "utf16le", "ucs2", "latin1", "binary"
          input = Buffer.from plaintext, encoding
        when "buffer"
          input = plaintext
        else
          throw new Error "Unknown encoding #{encoding}."
      params =
        KeyId: id
        Plaintext: input
      params = merge params, options
      {CiphertextBlob} = await kms.encrypt params
      CiphertextBlob.toString("base64")

    decrypt = (blob, encoding="utf8", options={}) ->
      params = CiphertextBlob: Buffer.from(blob, "base64")
      params = merge params, options
      {Plaintext} = await kms.decrypt params
      switch encoding
        when "utf8", "base64", "hex", "ascii", "utf16le", "ucs2", "latin1", "binary"
          Plaintext.toString encoding
        when "buffer"
          Plaintext
        else
          throw new Error "Unknown encoding #{encoding}."

    reEncrypt = (id, blob, options={}) ->
      params =
        DestinationKeyId: id
        CyphertextBlob: Buffer.from(blob, "base64")
      params = merge params, options
      {CiphertextBlob} = await kms.reEncrypt params
      CiphertextBlob.toString("base64")


    {get, create, scheduleDelete, addAlias, removeAlias, randomBytes, decrypt, encrypt, reEncrypt}


export default cognitoPrimitive
