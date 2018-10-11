# Primitives for the service KMS.
# NOTE: In KMS methods besides "create" and "delete" and "addAlias": ID can be key ID, key ARN, or key alias name.

import {cat, merge} from "panda-parchment"
import {notFound} from "./utils"
import {applyConfiguration} from "../lift"

cognitoPrimitive = (SDK) ->
  (configuration) ->
    kms = applyConfiguration configuration, SDK.KMS

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
      await kms.deleteKey params

    addAlias = (TargetKeyId, AliasName) ->
      await kms.createAlias {TargetKeyId, AliasName}

    removeAlias = (AliasName) ->
      await kms.deleteAlias {AliasName}

    randomKey = (size, encoding="hex") ->
      {Plaintext} = await kms.generateRandom {NumberOfBytes: size}
      switch encoding
        when "buffer"
          Plaintext
        when "ascii", "hex", "utf8", "utf16le", "ucs2", "latin1", "binary", "hex"
          Plaintext.toString encoding
        when "base64"
          # Omitting padding characters, per:
          # https://tools.ietf.org/html/rfc4648#section-3.2
          Plaintext.toString("base64")
          .replace(/\=+$/, '')
        when "base64padded"
          Plaintext.toString("base64")
        when "base64url"
          # Based on RFC 4648's "base64url" mapping:
          # https://tools.ietf.org/html/rfc4648#section-5
          Plaintext.toString("base64")
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/\=+$/, '')
        else
          throw new Error "Unknown encoding #{encoding}."

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


    {get, create, scheduleDelete, addAlias, removeAlias, randomKey, decrypt, encrypt, reEncrypt}


export default cognitoPrimitive
