import fs from "fs"
import Crypto from "crypto"

md5 = (buffer) ->
  Crypto.createHash('md5').update(buffer).digest("base64")

read = (path) -> do -> new Promise (resolve, reject) ->
  fs.readFile path, (error, data) ->
    if error?
      reject error
    else
      resolve data

export {md5, read}
