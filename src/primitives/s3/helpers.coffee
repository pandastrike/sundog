import Crypto from "crypto"

md5 = (buffer) ->
  Crypto.createHash('md5').update(buffer).digest("base64")

export {md5}
