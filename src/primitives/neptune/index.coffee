import {merge} from "panda-parchment"
#import {applyConfiguration} from "../../lift"
import Helpers from "./helpers"
import Model from "./model"

neptunePrimitive = (SDK) ->
  (configuration) ->
    #db = applyConfiguration configuration, SDK.DynamoDB

    merge [
      Helpers
      Model
    ]...

export default neptunePrimitive
