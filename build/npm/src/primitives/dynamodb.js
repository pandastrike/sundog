"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fairmont = require("fairmont");

var _utils = require("./utils");

var _lift = require("../lift");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Primitives for the service DynamoDB.
// The main entities are Tables and Items.
// This follows the naming convention that methods that work on Tables will be
// prefixed "table*", whereas item methods will have no prefix.
var dynamodbPrimitive,
    indexOf = [].indexOf;

dynamodbPrimitive = function (SDK) {
  return function (configuration) {
    var _areIndexesReady, _catCurrent, _delimiter, _isTableReady, _mark, _parseConditional, _parseName, _parseQuery, _qv, _setupCurrent, _transform, db, del, get, keysFilter, parse, put, query, qv, scan, tableCreate, tableDel, tableEmpty, tableGet, tableUpdate, tableWaitForDeleted, tableWaitForReady, to, update;

    db = (0, _lift.applyConfiguration)(configuration, SDK.DynamoDB); //===========================================================================
    // Tables
    //===========================================================================

    tableGet =
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(function* (name) {
        var Table, e;

        try {
          ({
            Table
          } = yield db.describeTable({
            TableName: name
          }));
          return Table;
        } catch (error) {
          e = error;
          return (0, _utils.notFound)(e, 400, "ResourceNotFoundException");
        }
      });

      return function tableGet(_x) {
        return _ref.apply(this, arguments);
      };
    }();

    tableCreate =
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(function* (name, keys, attributes, throughput, options = {}) {
        var TableDescription, p;
        p = {
          TableName: name,
          KeySchema: keys,
          AttributeDefinitions: attributes,
          ProvisionedThroughput: throughput
        };
        ({
          TableDescription
        } = yield db.createTable((0, _fairmont.merge)(p, options)));
        return TableDescription;
      });

      return function tableCreate(_x2, _x3, _x4, _x5) {
        return _ref2.apply(this, arguments);
      };
    }();

    tableUpdate =
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(function* (name, attributes, throughput, options = {}) {
        var TableDescription, p;
        p = {
          TableName: name,
          AttributeDefinitions: attributes
        };

        if (throughput) {
          p.ProvisionedThroughput = throughput;
        }

        ({
          TableDescription
        } = yield db.updateTable((0, _fairmont.merge)(p, options)));
        return TableDescription;
      });

      return function tableUpdate(_x6, _x7, _x8) {
        return _ref3.apply(this, arguments);
      };
    }();

    tableDel =
    /*#__PURE__*/
    function () {
      var _ref4 = _asyncToGenerator(function* (name) {
        var e;

        try {
          return yield db.deleteTable({
            TableName: name
          });
        } catch (error) {
          e = error;
          return (0, _utils.notFound)(e);
        }
      });

      return function tableDel(_x9) {
        return _ref4.apply(this, arguments);
      };
    }();

    _isTableReady =
    /*#__PURE__*/
    function () {
      var _ref5 = _asyncToGenerator(function* (name) {
        var TableStatus;

        while (true) {
          ({
            TableStatus
          } = yield tableGet(name));

          if (!TableStatus) {
            throw new Error(`Cannot find table ${name}`);
          } else if (TableStatus !== "ACTIVE") {
            yield (0, _fairmont.sleep)(5000);
          } else {
            return true;
          }
        }
      });

      return function _isTableReady(_x10) {
        return _ref5.apply(this, arguments);
      };
    }();

    _areIndexesReady =
    /*#__PURE__*/
    function () {
      var _ref6 = _asyncToGenerator(function* (name) {
        var indexes, statuses;

        while (true) {
          ({
            GlobalSecondaryIndexes: indexes
          } = yield tableGet(name));

          if (!indexes) {
            return true;
          }

          statuses = (0, _fairmont.collect)((0, _fairmont.project)("IndexStatus", indexes));

          if ((0, _fairmont.empty)((0, _fairmont.difference)(statuses, ["ACTIVE"]))) {
            return true;
          } else {
            yield (0, _fairmont.sleep)(5000);
          }
        }
      });

      return function _areIndexesReady(_x11) {
        return _ref6.apply(this, arguments);
      };
    }(); // The optional second parameter allows the developer to also wait on all global secondary indexes to also be ready.


    tableWaitForReady =
    /*#__PURE__*/
    function () {
      var _ref7 = _asyncToGenerator(function* (name, indexWait) {
        var checks;
        checks = [_isTableReady(name)];

        if (indexWait) {
          checks.push(_areIndexesReady(name));
        }

        return yield Promise.all(checks);
      });

      return function tableWaitForReady(_x12, _x13) {
        return _ref7.apply(this, arguments);
      };
    }();

    tableWaitForDeleted =
    /*#__PURE__*/
    function () {
      var _ref8 = _asyncToGenerator(function* (name) {
        var TableStatus;

        while (true) {
          ({
            TableStatus
          } = yield tableGet(name));

          if (!TableStatus) {
            return true;
          } else {
            yield (0, _fairmont.sleep)(5000);
          }
        }
      });

      return function tableWaitForDeleted(_x14) {
        return _ref8.apply(this, arguments);
      };
    }(); // TODO: make this more efficient by throttling to X connections at once. AWS
    // only supports N requests per second from an account, and I don't want this
    // to violate that limit, but we can do better than one at a time.


    keysFilter = (0, _fairmont.curry)(function (keys, item) {
      var f;

      f = function (key) {
        return indexOf.call(keys, key) >= 0;
      };

      return (0, _fairmont.pick)(f, item);
    });

    tableEmpty =
    /*#__PURE__*/
    function () {
      var _ref9 = _asyncToGenerator(function* (name) {
        var Items, KeySchema, filter, i, j, len, results1;
        ({
          KeySchema
        } = yield tableGet(name));
        filter = keysFilter((0, _fairmont.collect)((0, _fairmont.project)("AttributeName", KeySchema)));
        ({
          Items
        } = yield scan(name));
        results1 = [];

        for (j = 0, len = Items.length; j < len; j++) {
          i = Items[j];
          results1.push((yield del(name, filter(i))));
        }

        return results1;
      });

      return function tableEmpty(_x15) {
        return _ref9.apply(this, arguments);
      };
    }(); //===========================================================================
    // Type Helpers
    //===========================================================================
    // DynamoDB includes type information mapped into its data strctures.
    // It expects data to be input that way, and includes it when fetched.
    // These helpers write and parse that type system.


    _transform = function (f) {
      return function (x) {
        var k, out, v;

        if ((0, _fairmont.isObject)(x)) {
          out = {};

          for (k in x) {
            v = x[k];
            out[k] = _mark("anyonymousDynamodbValue", f(v));
          }

          return _mark("namedDynamodbValue", out);
        } else {
          return _mark("anyonymousDynamodbValue", f(x));
        }
      };
    };

    _mark = function (name, object) {
      return Object.defineProperty(object, "name", {
        value: name
      });
    };

    to = {
      S: _transform(function (s) {
        return {
          S: s.toString()
        };
      }),
      N: _transform(function (n) {
        return {
          N: n.toString()
        };
      }),
      B: _transform(function (b) {
        return {
          B: b.toString("base64")
        };
      }),
      SS: _transform(function (a) {
        var i;
        return {
          SS: function () {
            var j, len, results1;
            results1 = [];

            for (j = 0, len = a.length; j < len; j++) {
              i = a[j];
              results1.push(i.toString());
            }

            return results1;
          }()
        };
      }),
      NS: _transform(function (a) {
        var i;
        return {
          NS: function () {
            var j, len, results1;
            results1 = [];

            for (j = 0, len = a.length; j < len; j++) {
              i = a[j];
              results1.push(i.toString());
            }

            return results1;
          }()
        };
      }),
      BS: _transform(function (a) {
        var i;
        return {
          BS: function () {
            var j, len, results1;
            results1 = [];

            for (j = 0, len = a.length; j < len; j++) {
              i = a[j];
              results1.push(i.toString("base64"));
            }

            return results1;
          }()
        };
      }),
      M: _transform(function (m) {
        return {
          M: m
        };
      }),
      L: _transform(function (l) {
        return {
          L: l
        };
      }),
      Null: _transform(function (n) {
        return {
          NULL: n
        };
      }),
      Bool: _transform(function (b) {
        return {
          BOOL: b
        };
      })
    };

    parse = function (attributes) {
      var dataType, i, name, result, typeObj, v;
      result = {};

      for (name in attributes) {
        typeObj = attributes[name];
        dataType = (0, _fairmont.first)((0, _fairmont.keys)(typeObj));
        v = (0, _fairmont.first)((0, _fairmont.values)(typeObj));

        result[name] = function () {
          var j, len, len1, q, results1, results2;

          switch (dataType) {
            case "S":
            case "SS":
            case "L":
            case "BOOL":
              return v;

            case "N":
              return new Number(v);

            case "B":
              return Buffer.from(v, "base64");

            case "NS":
              results1 = [];

              for (j = 0, len = v.length; j < len; j++) {
                i = v[j];
                results1.push(new Number(i));
              }

              return results1;

            case "BS":
              results2 = [];

              for (q = 0, len1 = v.length; q < len1; q++) {
                i = v[q];
                results2.push(Buffer.from(i, "base64"));
              }

              return results2;

            case "NULL":
              if (v) {
                return null;
              } else {
                return void 0;
              }

              break;

            case "M":
              return parse(v);

            default:
              throw new Error(`Unable to parse object for DynamoDB attribute type. ${dataType}`);
          }
        }();
      }

      return result;
    }; //===========================================================================
    // Items
    //===========================================================================


    get =
    /*#__PURE__*/
    function () {
      var _ref10 = _asyncToGenerator(function* (name, key, options = {}) {
        var ConsumedCapacity, Item, ReturnConsumedCapacity, p;
        ({
          ReturnConsumedCapacity
        } = options);
        p = {
          TableName: name,
          Key: key
        };
        ({
          Item,
          ConsumedCapacity
        } = yield db.getItem((0, _fairmont.merge)(p, options)));

        if (ReturnConsumedCapacity) {
          return {
            Item,
            ConsumedCapacity
          };
        } else {
          return Item;
        }
      });

      return function get(_x16, _x17) {
        return _ref10.apply(this, arguments);
      };
    }();

    put =
    /*#__PURE__*/
    function () {
      var _ref11 = _asyncToGenerator(function* (name, item, options = {}) {
        var p;
        p = {
          TableName: name,
          Item: item
        };
        return yield db.putItem((0, _fairmont.merge)(p, options));
      });

      return function put(_x18, _x19) {
        return _ref11.apply(this, arguments);
      };
    }();

    del =
    /*#__PURE__*/
    function () {
      var _ref12 = _asyncToGenerator(function* (name, key, options = {}) {
        var p;
        p = {
          TableName: name,
          Key: key
        };
        return yield db.deleteItem((0, _fairmont.merge)(p, options));
      });

      return function del(_x20, _x21) {
        return _ref12.apply(this, arguments);
      };
    }(); //===========================================================================
    // Queries and Scans against Tables and Indexes
    //===========================================================================


    _delimiter = "<###SUNDOGDYNAMODB###>";

    _setupCurrent = function () {
      return {
        Items: [],
        Count: 0,
        ScannedCount: 0,
        LastEvaluatedKey: false,
        ConsumedCapacity: []
      };
    };

    _catCurrent = function (current, results) {
      var ConsumedCapacity, Count, Items, LastEvaluatedKey, ScannedCount;
      ({
        Items,
        Count,
        ScannedCount,
        LastEvaluatedKey,
        ConsumedCapacity
      } = results);
      current.Items = (0, _fairmont.cat)(current.Items, Items);
      current.Count += Count;
      current.ScannedCount += ScannedCount;

      if (LastEvaluatedKey) {
        current.LastEvaluatedKey = LastEvaluatedKey;
      }

      current.ConsumedCapacity = current.ConsumedCapacity.push(ConsumedCapacity);
      return current;
    };

    _parseName = function (name) {
      var parts;

      if (!name) {
        throw new Error("Must provide table name.");
      }

      parts = name.split(":");

      if (parts.length > 1) {
        return {
          tableName: parts[0],
          indexName: parts[1]
        };
      } else {
        return {
          tableName: name,
          indexName: false
        };
      }
    };

    _parseConditional = function (ex, count = 0) {
      var Values, re, result;

      if (!ex) {
        return {
          result: false,
          values: false,
          count
        };
      }

      Values = {};
      re = new RegExp(`${_delimiter}.+?${_delimiter}`, "g");
      result = ex.replace(re, function (match) {
        var obj, placeholder;
        [, obj] = match.split(_delimiter);
        placeholder = `:param${count}`;
        count++;
        Values[placeholder] = JSON.parse(obj);
        return placeholder; // Return placeholder to the expression we are processing.
      });
      return {
        result,
        values: Values,
        count
      };
    };

    _parseQuery = function (options, name, keyEx, filterEx) {
      var count, filter, filterValues, indexName, key, keyValues, out, tableName;
      ({
        tableName,
        indexName
      } = _parseName(name));
      ({
        result: key,
        values: keyValues,
        count
      } = _parseConditional(keyEx));
      ({
        result: filter,
        values: filterValues
      } = _parseConditional(filterEx, count));
      out = options;
      out.TableName = tableName;

      if (indexName) {
        out.IndexName = indexName;
      }

      if (key) {
        out.KeyConditionExpression = key;
      }

      if (filter) {
        out.FilterExpression = filter;
      }

      if (keyValues || filterValues) {
        out.ExpressionAttributeValues = (0, _fairmont.merge)(keyValues || {}, filterValues || {});
      }

      return out;
    }; // qv produces query strings with delimited values SunDog can parse.


    _qv = function (o) {
      var delimit;

      delimit = function (s) {
        return `${_delimiter}${s}${_delimiter}`;
      }; // Determine if this is a DynamoDB value, and whether is anyonymous or named.


      if (o.name === "anyonymousDynamodbValue") {
        return delimit(JSON.stringify(o));
      } else if (o.name === "namedDynamodbValue") {
        return delimit(JSON.stringify((0, _fairmont.first)((0, _fairmont.values)(o))));
      } else {
        throw new Error(`Unable to create stringified query value for unrecongied object ${JSON.stringify(o)}`);
      }
    };

    qv = _fairmont.Method.create();

    _fairmont.Method.define(qv, _fairmont.isFunction, function (f) {
      return function (x) {
        return _qv(f(x));
      };
    });

    _fairmont.Method.define(qv, _fairmont.isObject, function (o) {
      return _qv(o);
    });

    update =
    /*#__PURE__*/
    function () {
      var _ref13 = _asyncToGenerator(function* (name, key, updateEx, options = {}) {
        var p, result;
        p = {
          TableName: name,
          Key: key
        };
        ({
          result,
          values: _fairmont.values
        } = _parseConditional(updateEx));

        if (result) {
          options.UpdateExpression = result;
        }

        if (_fairmont.values) {
          options.ExpressionAttributeValues = _fairmont.values;
        }

        return yield db.updateItem((0, _fairmont.merge)(p, options));
      });

      return function update(_x22, _x23, _x24) {
        return _ref13.apply(this, arguments);
      };
    }();

    query =
    /*#__PURE__*/
    function () {
      var _ref14 = _asyncToGenerator(function* (name, keyEx, filterEx, options = {}, current) {
        var p, results;

        if (!current) {
          current = _setupCurrent();
        }

        if (!current.options) {
          current.options = options = _parseQuery(options, name, keyEx, filterEx);
        } else {
          ({
            options
          } = current);
        }

        p = {};

        if (current.LastEvaluatedKey) {
          p.ExclusiveStartKey = current.LastEvaluatedKey;
        }

        results = yield db.query((0, _fairmont.merge)(p, options));
        current = _catCurrent(current, results);

        if (!results.LastEvaluatedKey || options.Limit) {
          return current;
        } else {
          return yield query(name, keyEx, filterEx, options, current);
        }
      });

      return function query(_x25, _x26, _x27) {
        return _ref14.apply(this, arguments);
      };
    }();

    scan =
    /*#__PURE__*/
    function () {
      var _ref15 = _asyncToGenerator(function* (name, filterEx, options = {}, current) {
        var p, results;

        if (!current) {
          current = _setupCurrent();
        }

        if (!current.options) {
          current.options = options = _parseQuery(options, name, false, filterEx);
        } else {
          ({
            options
          } = current);
        }

        p = {};

        if (current.LastEvaluatedKey) {
          p.ExclusiveStartKey = current.LastEvaluatedKey;
        }

        results = yield db.scan((0, _fairmont.merge)(p, options));
        current = _catCurrent(current, results);

        if (!results.LastEvaluatedKey || options.Limit) {
          return current;
        } else {
          return yield scan(name, filterEx, options, current);
        }
      });

      return function scan(_x28, _x29) {
        return _ref15.apply(this, arguments);
      };
    }();

    return {
      tableGet,
      tableCreate,
      tableUpdate,
      tableDel,
      tableWaitForReady,
      tableWaitForDeleted,
      tableEmpty,
      keysFilter,
      to,
      parse,
      merge: _fairmont.merge,
      get,
      put,
      del,
      qv,
      update,
      query,
      scan
    };
  };
};

var _default = dynamodbPrimitive;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMvZHluYW1vZGIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFLQTs7QUFDQTs7QUFDQTs7Ozs7O0FBUEE7Ozs7QUFBQSxJQUFBLGlCQUFBO0FBQUEsSUFBQSxPQUFBLEdBQUEsR0FBQSxPQUFBOztBQVNBLGlCQUFBLEdBQW9CLFVBQUEsR0FBQSxFQUFBO1NBQ2xCLFVBQUEsYUFBQSxFQUFBO0FBQ0UsUUFBQSxnQkFBQSxFQUFBLFdBQUEsRUFBQSxVQUFBLEVBQUEsYUFBQSxFQUFBLEtBQUEsRUFBQSxpQkFBQSxFQUFBLFVBQUEsRUFBQSxXQUFBLEVBQUEsR0FBQSxFQUFBLGFBQUEsRUFBQSxVQUFBLEVBQUEsRUFBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsVUFBQSxFQUFBLEtBQUEsRUFBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsV0FBQSxFQUFBLFFBQUEsRUFBQSxVQUFBLEVBQUEsUUFBQSxFQUFBLFdBQUEsRUFBQSxtQkFBQSxFQUFBLGlCQUFBLEVBQUEsRUFBQSxFQUFBLE1BQUE7O0FBQUEsSUFBQSxFQUFBLEdBQUssOEJBQUEsYUFBQSxFQUFrQyxHQUFHLENBQTFDLFFBQUssQ0FBTCxDQURGLEM7Ozs7QUFNRSxJQUFBLFFBQUE7QUFBQTtBQUFBO0FBQUEsbUNBQVcsV0FBQSxJQUFBLEVBQUE7QUFDVCxZQUFBLEtBQUEsRUFBQSxDQUFBOztBQUFBLFlBQUE7QUFDRSxXQUFBO0FBQUEsWUFBQTtBQUFBLG9CQUFnQixFQUFFLENBQUYsYUFBQSxDQUFpQjtBQUFBLFlBQUEsU0FBQSxFQUFXO0FBQVgsV0FBakIsQ0FBaEI7aUJBREYsSztBQUFBLFNBQUEsQ0FBQSxPQUFBLEtBQUEsRUFBQTtBQUdNLFVBQUEsQ0FBQSxHQUFBLEtBQUE7aUJBQ0oscUJBQUEsQ0FBQSxFQUFBLEdBQUEsRUFKRiwyQkFJRSxDOztBQUxPLE9BQVg7O0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FBQTs7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LEVBQUE7aUJBQUEsTztBQUFBLFNBQUEsTUFBQTtBQUdFLHVCQUFNLElBQUEsQ0FBQSxJQUFBLEVBQUEsUUFBQSxFQUFBLE9BQUEsRUFIUixPQUdRLENBQU47O0FBZkcsT0FBUDs7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQUFBOztXQW1CQTtBQUFBLE1BQUEsUUFBQTtBQUFBLE1BQUEsV0FBQTtBQUFBLE1BQUEsV0FBQTtBQUFBLE1BQUEsUUFBQTtBQUFBLE1BQUEsaUJBQUE7QUFBQSxNQUFBLG1CQUFBO0FBQUEsTUFBQSxVQUFBO0FBQUEsTUFBQSxVQUFBO0FBQUEsTUFBQSxFQUFBO0FBQUEsTUFBQSxLQUFBO0FBQTBILE1BQUEsS0FBMUgsRUFBMEgsZUFBMUg7QUFBQSxNQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUE7QUFBQSxNQUFBLEVBQUE7QUFBQSxNQUFBLE1BQUE7QUFBQSxNQUFBLEtBQUE7QUFBQSxNQUFBO0FBQUEsSztBQTNRRixHO0FBRGtCLENBQXBCOztlQThRZSxpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgUHJpbWl0aXZlcyBmb3IgdGhlIHNlcnZpY2UgRHluYW1vREIuXG4jIFRoZSBtYWluIGVudGl0aWVzIGFyZSBUYWJsZXMgYW5kIEl0ZW1zLlxuIyBUaGlzIGZvbGxvd3MgdGhlIG5hbWluZyBjb252ZW50aW9uIHRoYXQgbWV0aG9kcyB0aGF0IHdvcmsgb24gVGFibGVzIHdpbGwgYmVcbiMgcHJlZml4ZWQgXCJ0YWJsZSpcIiwgd2hlcmVhcyBpdGVtIG1ldGhvZHMgd2lsbCBoYXZlIG5vIHByZWZpeC5cblxuaW1wb3J0IHttZXJnZSwgc2xlZXAsIGVtcHR5LCBjYXQsIGNvbGxlY3QsIHByb2plY3QsIHBpY2ssIGN1cnJ5LCBkaWZmZXJlbmNlLCBmaXJzdCwga2V5cywgdmFsdWVzLCBNZXRob2QsIGlzRnVuY3Rpb24sIGlzT2JqZWN0fSBmcm9tIFwiZmFpcm1vbnRcIlxuaW1wb3J0IHtub3RGb3VuZH0gZnJvbSBcIi4vdXRpbHNcIlxuaW1wb3J0IHthcHBseUNvbmZpZ3VyYXRpb259IGZyb20gXCIuLi9saWZ0XCJcblxuZHluYW1vZGJQcmltaXRpdmUgPSAoU0RLKSAtPlxuICAoY29uZmlndXJhdGlvbikgLT5cbiAgICBkYiA9IGFwcGx5Q29uZmlndXJhdGlvbiBjb25maWd1cmF0aW9uLCBTREsuRHluYW1vREJcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAjIFRhYmxlc1xuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICB0YWJsZUdldCA9IChuYW1lKSAtPlxuICAgICAgdHJ5XG4gICAgICAgIHtUYWJsZX0gPSBhd2FpdCBkYi5kZXNjcmliZVRhYmxlIFRhYmxlTmFtZTogbmFtZVxuICAgICAgICBUYWJsZVxuICAgICAgY2F0Y2ggZVxuICAgICAgICBub3RGb3VuZCBlLCA0MDAsIFwiUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvblwiXG5cbiAgICB0YWJsZUNyZWF0ZSA9IChuYW1lLCBrZXlzLCBhdHRyaWJ1dGVzLCB0aHJvdWdocHV0LCBvcHRpb25zPXt9KSAtPlxuICAgICAgcCA9XG4gICAgICAgIFRhYmxlTmFtZTogbmFtZVxuICAgICAgICBLZXlTY2hlbWE6IGtleXNcbiAgICAgICAgQXR0cmlidXRlRGVmaW5pdGlvbnM6IGF0dHJpYnV0ZXNcbiAgICAgICAgUHJvdmlzaW9uZWRUaHJvdWdocHV0OiB0aHJvdWdocHV0XG5cbiAgICAgIHtUYWJsZURlc2NyaXB0aW9ufT0gYXdhaXQgZGIuY3JlYXRlVGFibGUgbWVyZ2UgcCwgb3B0aW9uc1xuICAgICAgVGFibGVEZXNjcmlwdGlvblxuXG4gICAgdGFibGVVcGRhdGUgPSAobmFtZSwgYXR0cmlidXRlcywgdGhyb3VnaHB1dCwgb3B0aW9ucz17fSkgLT5cbiAgICAgIHAgPVxuICAgICAgICBUYWJsZU5hbWU6IG5hbWVcbiAgICAgICAgQXR0cmlidXRlRGVmaW5pdGlvbnM6IGF0dHJpYnV0ZXNcbiAgICAgIHAuUHJvdmlzaW9uZWRUaHJvdWdocHV0ID0gdGhyb3VnaHB1dCBpZiB0aHJvdWdocHV0XG5cbiAgICAgIHtUYWJsZURlc2NyaXB0aW9ufT0gYXdhaXQgZGIudXBkYXRlVGFibGUgbWVyZ2UgcCwgb3B0aW9uc1xuICAgICAgVGFibGVEZXNjcmlwdGlvblxuXG4gICAgdGFibGVEZWwgPSAobmFtZSkgLT5cbiAgICAgIHRyeVxuICAgICAgICBhd2FpdCBkYi5kZWxldGVUYWJsZSBUYWJsZU5hbWU6IG5hbWVcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgbm90Rm91bmQgZVxuXG5cbiAgICBfaXNUYWJsZVJlYWR5ID0gKG5hbWUpIC0+XG4gICAgICB3aGlsZSB0cnVlXG4gICAgICAgIHtUYWJsZVN0YXR1c30gPSBhd2FpdCB0YWJsZUdldCBuYW1lXG4gICAgICAgIGlmICFUYWJsZVN0YXR1c1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIkNhbm5vdCBmaW5kIHRhYmxlICN7bmFtZX1cIlxuICAgICAgICBlbHNlIGlmIFRhYmxlU3RhdHVzICE9IFwiQUNUSVZFXCJcbiAgICAgICAgICBhd2FpdCBzbGVlcCA1MDAwXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgX2FyZUluZGV4ZXNSZWFkeSA9IChuYW1lKSAtPlxuICAgICAgd2hpbGUgdHJ1ZVxuICAgICAgICB7R2xvYmFsU2Vjb25kYXJ5SW5kZXhlczogaW5kZXhlc30gPSBhd2FpdCB0YWJsZUdldCBuYW1lXG4gICAgICAgIHJldHVybiB0cnVlIGlmICFpbmRleGVzXG4gICAgICAgIHN0YXR1c2VzID0gY29sbGVjdCBwcm9qZWN0IFwiSW5kZXhTdGF0dXNcIiwgaW5kZXhlc1xuICAgICAgICBpZiBlbXB0eSBkaWZmZXJlbmNlIHN0YXR1c2VzLCBbXCJBQ1RJVkVcIl1cbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXdhaXQgc2xlZXAgNTAwMFxuXG4gICAgIyBUaGUgb3B0aW9uYWwgc2Vjb25kIHBhcmFtZXRlciBhbGxvd3MgdGhlIGRldmVsb3BlciB0byBhbHNvIHdhaXQgb24gYWxsIGdsb2JhbCBzZWNvbmRhcnkgaW5kZXhlcyB0byBhbHNvIGJlIHJlYWR5LlxuICAgIHRhYmxlV2FpdEZvclJlYWR5ID0gKG5hbWUsIGluZGV4V2FpdCkgLT5cbiAgICAgIGNoZWNrcyA9IFtfaXNUYWJsZVJlYWR5IG5hbWVdXG4gICAgICBjaGVja3MucHVzaCBfYXJlSW5kZXhlc1JlYWR5IG5hbWUgaWYgaW5kZXhXYWl0XG4gICAgICBhd2FpdCBQcm9taXNlLmFsbCBjaGVja3NcblxuICAgIHRhYmxlV2FpdEZvckRlbGV0ZWQgPSAobmFtZSkgLT5cbiAgICAgIHdoaWxlIHRydWVcbiAgICAgICAge1RhYmxlU3RhdHVzfSA9IGF3YWl0IHRhYmxlR2V0IG5hbWVcbiAgICAgICAgaWYgIVRhYmxlU3RhdHVzXG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF3YWl0IHNsZWVwIDUwMDBcblxuICAgICMgVE9ETzogbWFrZSB0aGlzIG1vcmUgZWZmaWNpZW50IGJ5IHRocm90dGxpbmcgdG8gWCBjb25uZWN0aW9ucyBhdCBvbmNlLiBBV1NcbiAgICAjIG9ubHkgc3VwcG9ydHMgTiByZXF1ZXN0cyBwZXIgc2Vjb25kIGZyb20gYW4gYWNjb3VudCwgYW5kIEkgZG9uJ3Qgd2FudCB0aGlzXG4gICAgIyB0byB2aW9sYXRlIHRoYXQgbGltaXQsIGJ1dCB3ZSBjYW4gZG8gYmV0dGVyIHRoYW4gb25lIGF0IGEgdGltZS5cbiAgICBrZXlzRmlsdGVyID0gY3VycnkgKGtleXMsIGl0ZW0pIC0+XG4gICAgICBmID0gKGtleSkgLT4ga2V5IGluIGtleXNcbiAgICAgIHBpY2sgZiwgaXRlbVxuXG4gICAgdGFibGVFbXB0eSA9IChuYW1lKSAtPlxuICAgICAge0tleVNjaGVtYX0gPSBhd2FpdCB0YWJsZUdldCBuYW1lXG4gICAgICBmaWx0ZXIgPSBrZXlzRmlsdGVyIGNvbGxlY3QgcHJvamVjdCBcIkF0dHJpYnV0ZU5hbWVcIiwgS2V5U2NoZW1hXG5cbiAgICAgIHtJdGVtc30gPSBhd2FpdCBzY2FuIG5hbWVcbiAgICAgIGF3YWl0IGRlbCBuYW1lLCBmaWx0ZXIoaSkgZm9yIGkgaW4gSXRlbXNcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAjIFR5cGUgSGVscGVyc1xuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAjIER5bmFtb0RCIGluY2x1ZGVzIHR5cGUgaW5mb3JtYXRpb24gbWFwcGVkIGludG8gaXRzIGRhdGEgc3RyY3R1cmVzLlxuICAgICMgSXQgZXhwZWN0cyBkYXRhIHRvIGJlIGlucHV0IHRoYXQgd2F5LCBhbmQgaW5jbHVkZXMgaXQgd2hlbiBmZXRjaGVkLlxuICAgICMgVGhlc2UgaGVscGVycyB3cml0ZSBhbmQgcGFyc2UgdGhhdCB0eXBlIHN5c3RlbS5cbiAgICBfdHJhbnNmb3JtID0gKGYpIC0+XG4gICAgICAoeCkgLT5cbiAgICAgICAgaWYgaXNPYmplY3QgeFxuICAgICAgICAgIG91dCA9IHt9XG4gICAgICAgICAgb3V0W2tdID0gX21hcmsoXCJhbnlvbnltb3VzRHluYW1vZGJWYWx1ZVwiLCBmIHYpIGZvciBrLCB2IG9mIHhcbiAgICAgICAgICBfbWFyayBcIm5hbWVkRHluYW1vZGJWYWx1ZVwiLCBvdXRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIF9tYXJrIFwiYW55b255bW91c0R5bmFtb2RiVmFsdWVcIiwgZiB4XG5cbiAgICBfbWFyayA9IChuYW1lLCBvYmplY3QpIC0+IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBvYmplY3QsIFwibmFtZVwiLCB2YWx1ZTogbmFtZVxuXG4gICAgdG8gPVxuICAgICAgUzogX3RyYW5zZm9ybSAocykgLT4gUzogcy50b1N0cmluZygpXG4gICAgICBOOiBfdHJhbnNmb3JtIChuKSAtPiBOOiBuLnRvU3RyaW5nKClcbiAgICAgIEI6IF90cmFuc2Zvcm0gKGIpIC0+IEI6IGIudG9TdHJpbmcoXCJiYXNlNjRcIilcbiAgICAgIFNTOiBfdHJhbnNmb3JtIChhKSAtPiBTUzogKGkudG9TdHJpbmcoKSBmb3IgaSBpbiBhKVxuICAgICAgTlM6IF90cmFuc2Zvcm0gKGEpIC0+IE5TOiAoaS50b1N0cmluZygpIGZvciBpIGluIGEpXG4gICAgICBCUzogX3RyYW5zZm9ybSAoYSkgLT4gQlM6IChpLnRvU3RyaW5nKFwiYmFzZTY0XCIpIGZvciBpIGluIGEpXG4gICAgICBNOiBfdHJhbnNmb3JtIChtKSAtPiBNOiBtXG4gICAgICBMOiBfdHJhbnNmb3JtIChsKSAtPiBMOiBsXG4gICAgICBOdWxsOiBfdHJhbnNmb3JtIChuKSAtPiBOVUxMOiBuXG4gICAgICBCb29sOiBfdHJhbnNmb3JtIChiKSAtPiBCT09MOiBiXG5cbiAgICBwYXJzZSA9IChhdHRyaWJ1dGVzKSAtPlxuICAgICAgcmVzdWx0ID0ge31cbiAgICAgIGZvciBuYW1lLCB0eXBlT2JqIG9mIGF0dHJpYnV0ZXNcbiAgICAgICAgZGF0YVR5cGUgPSBmaXJzdCBrZXlzIHR5cGVPYmpcbiAgICAgICAgdiA9IGZpcnN0IHZhbHVlcyB0eXBlT2JqXG4gICAgICAgIHJlc3VsdFtuYW1lXSA9IHN3aXRjaCBkYXRhVHlwZVxuICAgICAgICAgIHdoZW4gXCJTXCIsIFwiU1NcIiwgXCJMXCIsIFwiQk9PTFwiIHRoZW4gdlxuICAgICAgICAgIHdoZW4gXCJOXCIgdGhlbiBuZXcgTnVtYmVyIHZcbiAgICAgICAgICB3aGVuIFwiQlwiIHRoZW4gQnVmZmVyLmZyb20gdiwgXCJiYXNlNjRcIlxuICAgICAgICAgIHdoZW4gXCJOU1wiIHRoZW4gKG5ldyBOdW1iZXIgaSBmb3IgaSBpbiB2KVxuICAgICAgICAgIHdoZW4gXCJCU1wiIHRoZW4gKEJ1ZmZlci5mcm9tIGksIFwiYmFzZTY0XCIgZm9yIGkgaW4gdilcbiAgICAgICAgICB3aGVuIFwiTlVMTFwiXG4gICAgICAgICAgICBpZiB2IHRoZW4gbnVsbCBlbHNlIHVuZGVmaW5lZFxuICAgICAgICAgIHdoZW4gXCJNXCIgdGhlbiBwYXJzZSB2XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiVW5hYmxlIHRvIHBhcnNlIG9iamVjdCBmb3IgRHluYW1vREIgYXR0cmlidXRlIHR5cGUuICN7ZGF0YVR5cGV9XCJcbiAgICAgIHJlc3VsdFxuXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgIyBJdGVtc1xuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBnZXQgPSAobmFtZSwga2V5LCBvcHRpb25zPXt9KSAtPlxuICAgICAge1JldHVybkNvbnN1bWVkQ2FwYWNpdHl9ID0gb3B0aW9uc1xuICAgICAgcCA9IHtUYWJsZU5hbWU6IG5hbWUsIEtleToga2V5fVxuICAgICAge0l0ZW0sIENvbnN1bWVkQ2FwYWNpdHl9ID0gYXdhaXQgZGIuZ2V0SXRlbSBtZXJnZSBwLCBvcHRpb25zXG4gICAgICBpZiBSZXR1cm5Db25zdW1lZENhcGFjaXR5IHRoZW4ge0l0ZW0sIENvbnN1bWVkQ2FwYWNpdHl9IGVsc2UgSXRlbVxuXG4gICAgcHV0ID0gKG5hbWUsIGl0ZW0sIG9wdGlvbnM9e30pIC0+XG4gICAgICBwID0ge1RhYmxlTmFtZTogbmFtZSwgSXRlbTogaXRlbX1cbiAgICAgIGF3YWl0IGRiLnB1dEl0ZW0gbWVyZ2UgcCwgb3B0aW9uc1xuXG4gICAgZGVsID0gKG5hbWUsIGtleSwgb3B0aW9ucz17fSkgLT5cbiAgICAgIHAgPSB7VGFibGVOYW1lOiBuYW1lLCBLZXk6IGtleX1cbiAgICAgIGF3YWl0IGRiLmRlbGV0ZUl0ZW0gbWVyZ2UgcCwgb3B0aW9uc1xuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICMgUXVlcmllcyBhbmQgU2NhbnMgYWdhaW5zdCBUYWJsZXMgYW5kIEluZGV4ZXNcbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgX2RlbGltaXRlciA9IFwiPCMjI1NVTkRPR0RZTkFNT0RCIyMjPlwiXG4gICAgX3NldHVwQ3VycmVudCA9IC0+XG4gICAgICBJdGVtczogW11cbiAgICAgIENvdW50OiAwXG4gICAgICBTY2FubmVkQ291bnQ6IDBcbiAgICAgIExhc3RFdmFsdWF0ZWRLZXk6IGZhbHNlXG4gICAgICBDb25zdW1lZENhcGFjaXR5OiBbXVxuXG4gICAgX2NhdEN1cnJlbnQgPSAoY3VycmVudCwgcmVzdWx0cykgLT5cbiAgICAgIHtJdGVtcywgQ291bnQsIFNjYW5uZWRDb3VudCwgTGFzdEV2YWx1YXRlZEtleSwgQ29uc3VtZWRDYXBhY2l0eX0gPSByZXN1bHRzXG4gICAgICBjdXJyZW50Lkl0ZW1zID0gY2F0IGN1cnJlbnQuSXRlbXMsIEl0ZW1zXG4gICAgICBjdXJyZW50LkNvdW50ICs9IENvdW50XG4gICAgICBjdXJyZW50LlNjYW5uZWRDb3VudCArPSBTY2FubmVkQ291bnRcbiAgICAgIGN1cnJlbnQuTGFzdEV2YWx1YXRlZEtleSA9IExhc3RFdmFsdWF0ZWRLZXkgaWYgTGFzdEV2YWx1YXRlZEtleVxuICAgICAgY3VycmVudC5Db25zdW1lZENhcGFjaXR5ID0gY3VycmVudC5Db25zdW1lZENhcGFjaXR5LnB1c2ggQ29uc3VtZWRDYXBhY2l0eVxuICAgICAgY3VycmVudFxuXG4gICAgX3BhcnNlTmFtZSA9IChuYW1lKSAtPlxuICAgICAgdGhyb3cgbmV3IEVycm9yIFwiTXVzdCBwcm92aWRlIHRhYmxlIG5hbWUuXCIgaWYgIW5hbWVcbiAgICAgIHBhcnRzID0gbmFtZS5zcGxpdCBcIjpcIlxuICAgICAgaWYgcGFydHMubGVuZ3RoID4gMVxuICAgICAgICB7dGFibGVOYW1lOiBwYXJ0c1swXSwgaW5kZXhOYW1lOiBwYXJ0c1sxXX1cbiAgICAgIGVsc2VcbiAgICAgICAge3RhYmxlTmFtZTogbmFtZSwgaW5kZXhOYW1lOiBmYWxzZX1cblxuICAgIF9wYXJzZUNvbmRpdGlvbmFsID0gKGV4LCBjb3VudD0wKSAtPlxuICAgICAgcmV0dXJuIHtyZXN1bHQ6ZmFsc2UsIHZhbHVlczpmYWxzZSwgY291bnR9IGlmICFleFxuICAgICAgVmFsdWVzID0ge31cbiAgICAgIHJlID0gbmV3IFJlZ0V4cCBcIiN7X2RlbGltaXRlcn0uKz8je19kZWxpbWl0ZXJ9XCIsIFwiZ1wiXG5cbiAgICAgIHJlc3VsdCA9IGV4LnJlcGxhY2UgcmUsIChtYXRjaCkgLT5cbiAgICAgICAgWywgb2JqXSA9IG1hdGNoLnNwbGl0IF9kZWxpbWl0ZXJcbiAgICAgICAgcGxhY2Vob2xkZXIgPSBcIjpwYXJhbSN7Y291bnR9XCJcbiAgICAgICAgY291bnQrK1xuICAgICAgICBWYWx1ZXNbcGxhY2Vob2xkZXJdID0gSlNPTi5wYXJzZSBvYmpcbiAgICAgICAgcGxhY2Vob2xkZXIgIyBSZXR1cm4gcGxhY2Vob2xkZXIgdG8gdGhlIGV4cHJlc3Npb24gd2UgYXJlIHByb2Nlc3NpbmcuXG5cbiAgICAgIHtyZXN1bHQsIHZhbHVlczpWYWx1ZXMsIGNvdW50fVxuXG4gICAgX3BhcnNlUXVlcnkgPSAob3B0aW9ucywgbmFtZSwga2V5RXgsIGZpbHRlckV4KSAtPlxuICAgICAge3RhYmxlTmFtZSwgaW5kZXhOYW1lfSA9IF9wYXJzZU5hbWUgbmFtZVxuICAgICAge3Jlc3VsdDprZXksIHZhbHVlczprZXlWYWx1ZXMsIGNvdW50fSA9IF9wYXJzZUNvbmRpdGlvbmFsIGtleUV4XG4gICAgICB7cmVzdWx0OmZpbHRlciwgdmFsdWVzOmZpbHRlclZhbHVlc30gPSBfcGFyc2VDb25kaXRpb25hbCBmaWx0ZXJFeCwgY291bnRcblxuICAgICAgb3V0ID0gb3B0aW9uc1xuICAgICAgb3V0LlRhYmxlTmFtZSA9IHRhYmxlTmFtZVxuICAgICAgb3V0LkluZGV4TmFtZSA9IGluZGV4TmFtZSBpZiBpbmRleE5hbWVcbiAgICAgIG91dC5LZXlDb25kaXRpb25FeHByZXNzaW9uID0ga2V5IGlmIGtleVxuICAgICAgb3V0LkZpbHRlckV4cHJlc3Npb24gPSBmaWx0ZXIgaWYgZmlsdGVyXG4gICAgICBpZiBrZXlWYWx1ZXMgfHwgZmlsdGVyVmFsdWVzXG4gICAgICAgIG91dC5FeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzID1cbiAgICAgICAgICBtZXJnZSAoa2V5VmFsdWVzIHx8IHt9KSwgKGZpbHRlclZhbHVlcyB8fCB7fSlcbiAgICAgIG91dFxuXG4gICAgIyBxdiBwcm9kdWNlcyBxdWVyeSBzdHJpbmdzIHdpdGggZGVsaW1pdGVkIHZhbHVlcyBTdW5Eb2cgY2FuIHBhcnNlLlxuICAgIF9xdiA9IChvKSAtPlxuICAgICAgZGVsaW1pdCA9IChzKSAtPiBcIiN7X2RlbGltaXRlcn0je3N9I3tfZGVsaW1pdGVyfVwiXG4gICAgICAjIERldGVybWluZSBpZiB0aGlzIGlzIGEgRHluYW1vREIgdmFsdWUsIGFuZCB3aGV0aGVyIGlzIGFueW9ueW1vdXMgb3IgbmFtZWQuXG4gICAgICBpZiBvLm5hbWUgPT0gXCJhbnlvbnltb3VzRHluYW1vZGJWYWx1ZVwiXG4gICAgICAgIGRlbGltaXQgSlNPTi5zdHJpbmdpZnkgb1xuICAgICAgZWxzZSBpZiBvLm5hbWUgPT0gXCJuYW1lZER5bmFtb2RiVmFsdWVcIlxuICAgICAgICBkZWxpbWl0IEpTT04uc3RyaW5naWZ5IGZpcnN0IHZhbHVlcyBvXG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIlVuYWJsZSB0byBjcmVhdGUgc3RyaW5naWZpZWQgcXVlcnkgdmFsdWUgZm9yIHVucmVjb25naWVkIG9iamVjdCAje0pTT04uc3RyaW5naWZ5IG99XCJcblxuICAgIHF2ID0gTWV0aG9kLmNyZWF0ZSgpXG4gICAgTWV0aG9kLmRlZmluZSBxdiwgaXNGdW5jdGlvbiwgKGYpIC0+ICh4KSAtPiBfcXYgZiB4XG4gICAgTWV0aG9kLmRlZmluZSBxdiwgaXNPYmplY3QsIChvKSAtPiBfcXYgb1xuXG4gICAgdXBkYXRlID0gKG5hbWUsIGtleSwgdXBkYXRlRXgsIG9wdGlvbnM9e30pIC0+XG4gICAgICBwID0ge1RhYmxlTmFtZTogbmFtZSwgS2V5OiBrZXl9XG4gICAgICB7cmVzdWx0LCB2YWx1ZXN9ID0gX3BhcnNlQ29uZGl0aW9uYWwgdXBkYXRlRXhcbiAgICAgIG9wdGlvbnMuVXBkYXRlRXhwcmVzc2lvbiA9IHJlc3VsdCBpZiByZXN1bHRcbiAgICAgIG9wdGlvbnMuRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlcyA9IHZhbHVlcyBpZiB2YWx1ZXNcbiAgICAgIGF3YWl0IGRiLnVwZGF0ZUl0ZW0gbWVyZ2UgcCwgb3B0aW9uc1xuXG4gICAgcXVlcnkgPSAobmFtZSwga2V5RXgsIGZpbHRlckV4LCBvcHRpb25zPXt9LCBjdXJyZW50KSAtPlxuICAgICAgY3VycmVudCA9IF9zZXR1cEN1cnJlbnQoKSBpZiAhY3VycmVudFxuICAgICAgaWYgIWN1cnJlbnQub3B0aW9uc1xuICAgICAgICBjdXJyZW50Lm9wdGlvbnMgPSBvcHRpb25zID0gX3BhcnNlUXVlcnkgb3B0aW9ucywgbmFtZSwga2V5RXgsIGZpbHRlckV4XG4gICAgICBlbHNlXG4gICAgICAgIHtvcHRpb25zfSA9IGN1cnJlbnRcblxuICAgICAgcCA9IHt9XG4gICAgICBwLkV4Y2x1c2l2ZVN0YXJ0S2V5ID0gY3VycmVudC5MYXN0RXZhbHVhdGVkS2V5IGlmIGN1cnJlbnQuTGFzdEV2YWx1YXRlZEtleVxuICAgICAgcmVzdWx0cyA9IGF3YWl0IGRiLnF1ZXJ5IG1lcmdlIHAsIG9wdGlvbnNcblxuICAgICAgY3VycmVudCA9IF9jYXRDdXJyZW50IGN1cnJlbnQsIHJlc3VsdHNcbiAgICAgIGlmICFyZXN1bHRzLkxhc3RFdmFsdWF0ZWRLZXkgfHwgb3B0aW9ucy5MaW1pdFxuICAgICAgICBjdXJyZW50XG4gICAgICBlbHNlXG4gICAgICAgIGF3YWl0IHF1ZXJ5IG5hbWUsIGtleUV4LCBmaWx0ZXJFeCwgb3B0aW9ucywgY3VycmVudFxuXG4gICAgc2NhbiA9IChuYW1lLCBmaWx0ZXJFeCwgb3B0aW9ucz17fSwgY3VycmVudCkgLT5cbiAgICAgIGN1cnJlbnQgPSBfc2V0dXBDdXJyZW50KCkgaWYgIWN1cnJlbnRcbiAgICAgIGlmICFjdXJyZW50Lm9wdGlvbnNcbiAgICAgICAgY3VycmVudC5vcHRpb25zID0gb3B0aW9ucyA9IF9wYXJzZVF1ZXJ5IG9wdGlvbnMsIG5hbWUsIGZhbHNlLCBmaWx0ZXJFeFxuICAgICAgZWxzZVxuICAgICAgICB7b3B0aW9uc30gPSBjdXJyZW50XG5cbiAgICAgIHAgPSB7fVxuICAgICAgcC5FeGNsdXNpdmVTdGFydEtleSA9IGN1cnJlbnQuTGFzdEV2YWx1YXRlZEtleSBpZiBjdXJyZW50Lkxhc3RFdmFsdWF0ZWRLZXlcbiAgICAgIHJlc3VsdHMgPSBhd2FpdCBkYi5zY2FuIG1lcmdlIHAsIG9wdGlvbnNcblxuICAgICAgY3VycmVudCA9IF9jYXRDdXJyZW50IGN1cnJlbnQsIHJlc3VsdHNcbiAgICAgIGlmICFyZXN1bHRzLkxhc3RFdmFsdWF0ZWRLZXkgfHwgb3B0aW9ucy5MaW1pdFxuICAgICAgICBjdXJyZW50XG4gICAgICBlbHNlXG4gICAgICAgIGF3YWl0IHNjYW4gbmFtZSwgZmlsdGVyRXgsIG9wdGlvbnMsIGN1cnJlbnRcblxuXG5cbiAgICB7dGFibGVHZXQsIHRhYmxlQ3JlYXRlLCB0YWJsZVVwZGF0ZSwgdGFibGVEZWwsIHRhYmxlV2FpdEZvclJlYWR5LCB0YWJsZVdhaXRGb3JEZWxldGVkLCB0YWJsZUVtcHR5LCBrZXlzRmlsdGVyLCB0bywgcGFyc2UsIG1lcmdlLCBnZXQsIHB1dCwgZGVsLCBxdiwgdXBkYXRlLCBxdWVyeSwgc2Nhbn1cblxuZXhwb3J0IGRlZmF1bHQgZHluYW1vZGJQcmltaXRpdmVcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=primitives/dynamodb.coffee