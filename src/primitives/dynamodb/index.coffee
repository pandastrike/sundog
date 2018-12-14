# Primitives for the service DynamoDB.
# The main entities are Tables and Items.
# This follows the naming convention that methods that work on Tables will be
# prefixed "table*", whereas item methods will have no prefix.

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
