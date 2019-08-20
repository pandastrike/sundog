import {include} from "panda-parchment"
import {prepareModule} from "../../lift"
import Tables from "./tables"
import Items from "./items"
import Queries from "./queries"
import Model from "./model"
import Expressions from "./helpers/expressions"
import Types from "./helpers/types"

dynamodbPrimitive = (options) ->
  (configuration) ->
    db = prepareModule options, configuration,
      require("aws-sdk/clients/dynamodb"),
      [
        "describeTable"
        "createTable"
        "updateTable"
        "deleteTable"

        "getItem"
        "putItem"
        "deleteItem"
        "updateItem"

        "query"
        "scan"
      ]

    output = {}
    include output, Tables db
    include output, Items db
    include output, Queries db
    include output, Types
    include output, Expressions
    include output, Model output
    output

export default dynamodbPrimitive
