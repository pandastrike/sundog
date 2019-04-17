import {cat, fromJSON} from "panda-parchment"
import {collect, project} from "panda-river"
import {Method} from "panda-generics"
import {applyConfiguration} from "../lift"

asmPrimitive = (SDK) ->
  (configuration) ->
    asm = applyConfiguration configuration, SDK.SecretsManager

    list = (items=[], marker) ->
      parameters = if marker? then {NextToken: marker} else {}

      {SecretList, NextToken} = await asm.llistSecrets parameters
      items = cat items, SecretList
      if NextToken?
        await list items, NextToken
      else
        items

    get = (name) -> asm.getSecretValue SecretId: name

    read = (name) ->
        data = await asm.getSecretValue SecretId: name
        if data["SecretString"]?
          fromJSON data["SecretString"]
        else
          Buffer.from data.SecretBinary, 'base64'

    exists = (name) ->
      try
        await get name
        true
      catch e
        false

    {list, get, read, exists}

export default asmPrimitive
