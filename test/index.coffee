import "babel-polyfill"
import Sundog from "../src"

do ->
  sundog = await Sundog "us-west-2"
  console.log sundog.AWS
