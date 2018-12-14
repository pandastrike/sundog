import {merge} from "panda-parchment"
import {applyConfiguration} from "../../lift"
import Tables from "./tables"
import Items from "./items"
import Queries from "./queries"
import Expressions from "./helpers/expressions"
import Types from "./helpers/types"

dynamodbPrimitive = (SDK) ->
  (configuration) ->
    db = applyConfiguration configuration, SDK.DynamoDB

    merge [
      Tables db
      Items db
      Queries db
      Expressions
      Types
    ]

export default dynamodbPrimitive
