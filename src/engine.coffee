# SunDog uses the AWS-SDK and your credentials to directly interact with Amazon.
# In Node, SunDog looks to your home directory for credentials in their defualt location.
import {join} from "path"
import {homedir} from "os"
import AWS from "aws-sdk"
import {read} from "fairmont"

# Looks for AWS credentials stored at ~/.aws/credentials
awsPath = join homedir(), ".aws", "credentials"

parseCreds = (data) ->
  lines = data.split "\n"
  get = (line) -> line.split(/\s*=\s*/)[1]
  where = (phrase) ->
    for i in [0...lines.length]
      return i if lines[i].indexOf(phrase) >= 0

  id: get lines[where "aws_access_key_id"]
  key: get lines[where "aws_secret_access_key"]

Engine = (region) ->
  {id, key} = parseCreds await read awsPath
  AWS.config =
     accessKeyId: id
     secretAccessKey: key
     region: region || "us-west-2"
     sslEnabled: true
  AWS

export default Engine
