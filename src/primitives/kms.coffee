# Primitives for the service KMS.
# NOTE: In KMS, ID can be key ID, key ARN, or key alias name.

import {cat, merge} from "fairmont"
import {notFound} from "./utils"

cognitoPrimative = (_AWS) ->
  kms = _AWS.KMS

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

  get = (id, tokens) ->
    try
      params = {KeyId: id}
      params.GrantTokens = tokens if tokens
      {KeyMetadata} = await kms.describeKey params
      KeyMetadata
    catch e
      notFound e, 400, "NotFoundException"

  randomKey = (size, encoding="hex") ->
    {Plaintext} = await kms.generateRandom {NumberOfBytes: size}
    switch encoding
      when "buffer"
        Plaintext
      when "ascii", "hex", "utf8", "utf16le", "ucs2", "latin1", "binary", "hex"
        Plaintext.toString encoding
      when "base64"
        # Omitting padding characters, per:
        # http://tools.ietf.org/html/rfc4648#section-3.2
        Plaintext.toString("base64")
        .replace(/\=+$/, '')
      when "base64url"
        # Based on RFC 4648's "base64url" mapping:
        # http://tools.ietf.org/html/rfc4648#section-5
        Plaintext.toString("base64")
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/\=+$/, '')
      else
        throw new Error "Unknown encoding #{encoding}."


  {decrypt, encrypt, get, reEncrypt, randomKey}


export default cognitoPrimative
