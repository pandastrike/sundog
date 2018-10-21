"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pandaGarden = require("panda-garden");

var _pandaParchment = require("panda-parchment");

var _pandaGenerics = require("panda-generics");

var _pandaRiver = require("panda-river");

var _utils = require("./utils");

var _lift = require("../lift");

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

    tableGet = async function (name) {
      var Table, e;

      try {
        ({
          Table
        } = await db.describeTable({
          TableName: name
        }));
        return Table;
      } catch (error) {
        e = error;
        return (0, _utils.notFound)(e, 400, "ResourceNotFoundException");
      }
    };

    tableCreate = async function (name, keys, attributes, throughput, options = {}) {
      var TableDescription, p;
      p = {
        TableName: name,
        KeySchema: keys,
        AttributeDefinitions: attributes,
        ProvisionedThroughput: throughput
      };
      ({
        TableDescription
      } = await db.createTable((0, _pandaParchment.merge)(p, options)));
      return TableDescription;
    };

    tableUpdate = async function (name, attributes, throughput, options = {}) {
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
      } = await db.updateTable((0, _pandaParchment.merge)(p, options)));
      return TableDescription;
    };

    tableDel = async function (name) {
      var e;

      try {
        return await db.deleteTable({
          TableName: name
        });
      } catch (error) {
        e = error;
        return (0, _utils.notFound)(e);
      }
    };

    _isTableReady = async function (name) {
      var TableStatus;

      while (true) {
        ({
          TableStatus
        } = await tableGet(name));

        if (!TableStatus) {
          throw new Error(`Cannot find table ${name}`);
        } else if (TableStatus !== "ACTIVE") {
          await (0, _pandaParchment.sleep)(5000);
        } else {
          return true;
        }
      }
    };

    _areIndexesReady = async function (name) {
      var indexes, statuses;

      while (true) {
        ({
          GlobalSecondaryIndexes: indexes
        } = await tableGet(name));

        if (!indexes) {
          return true;
        }

        statuses = (0, _pandaRiver.collect)((0, _pandaRiver.project)("IndexStatus", indexes));

        if ((0, _pandaParchment.empty)((0, _pandaParchment.difference)(statuses, ["ACTIVE"]))) {
          return true;
        } else {
          await (0, _pandaParchment.sleep)(5000);
        }
      }
    }; // The optional second parameter allows the developer to also wait on all global secondary indexes to also be ready.


    tableWaitForReady = async function (name, indexWait) {
      var checks;
      checks = [_isTableReady(name)];

      if (indexWait) {
        checks.push(_areIndexesReady(name));
      }

      return await Promise.all(checks);
    };

    tableWaitForDeleted = async function (name) {
      var TableStatus;

      while (true) {
        ({
          TableStatus
        } = await tableGet(name));

        if (!TableStatus) {
          return true;
        } else {
          await (0, _pandaParchment.sleep)(5000);
        }
      }
    }; // TODO: make this more efficient by throttling to X connections at once. AWS
    // only supports N requests per second from an account, and I don't want this
    // to violate that limit, but we can do better than one at a time.


    keysFilter = (0, _pandaGarden.curry)(function (keys, item) {
      var f;

      f = function (key) {
        return indexOf.call(keys, key) >= 0;
      };

      return (0, _pandaParchment.pick)(f, item);
    });

    tableEmpty = async function (name) {
      var Items, KeySchema, filter, i, j, len, results1;
      ({
        KeySchema
      } = await tableGet(name));
      filter = keysFilter((0, _pandaRiver.collect)((0, _pandaRiver.project)("AttributeName", KeySchema)));
      ({
        Items
      } = await scan(name));
      results1 = [];

      for (j = 0, len = Items.length; j < len; j++) {
        i = Items[j];
        results1.push((await del(name, filter(i))));
      }

      return results1;
    }; //===========================================================================
    // Type Helpers
    //===========================================================================
    // DynamoDB includes type information mapped into its data strctures.
    // It expects data to be input that way, and includes it when fetched.
    // These helpers write and parse that type system.


    _transform = function (f) {
      return function (x) {
        var k, out, v;

        if ((0, _pandaParchment.isObject)(x)) {
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
        dataType = (0, _pandaParchment.first)((0, _pandaParchment.keys)(typeObj));
        v = (0, _pandaParchment.first)((0, _pandaParchment.values)(typeObj));

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


    get = async function (name, key, options = {}) {
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
      } = await db.getItem((0, _pandaParchment.merge)(p, options)));

      if (ReturnConsumedCapacity) {
        return {
          Item,
          ConsumedCapacity
        };
      } else {
        return Item;
      }
    };

    put = async function (name, item, options = {}) {
      var p;
      p = {
        TableName: name,
        Item: item
      };
      return await db.putItem((0, _pandaParchment.merge)(p, options));
    };

    del = async function (name, key, options = {}) {
      var p;
      p = {
        TableName: name,
        Key: key
      };
      return await db.deleteItem((0, _pandaParchment.merge)(p, options));
    }; //===========================================================================
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
      current.Items = (0, _pandaParchment.cat)(current.Items, Items);
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
        out.ExpressionAttributeValues = (0, _pandaParchment.merge)(keyValues || {}, filterValues || {});
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
        return delimit(JSON.stringify((0, _pandaParchment.first)((0, _pandaParchment.values)(o))));
      } else {
        throw new Error(`Unable to create stringified query value for unrecongied object ${JSON.stringify(o)}`);
      }
    };

    qv = _pandaGenerics.Method.create();

    _pandaGenerics.Method.define(qv, _pandaParchment.isFunction, function (f) {
      return function (x) {
        return _qv(f(x));
      };
    });

    _pandaGenerics.Method.define(qv, _pandaParchment.isObject, function (o) {
      return _qv(o);
    });

    update = async function (name, key, updateEx, options = {}) {
      var _values, p, result;

      p = {
        TableName: name,
        Key: key
      };
      ({
        result,
        values: _values
      } = _parseConditional(updateEx));

      if (result) {
        options.UpdateExpression = result;
      }

      if (_values) {
        options.ExpressionAttributeValues = _values;
      }

      return await db.updateItem((0, _pandaParchment.merge)(p, options));
    };

    query = async function (name, keyEx, filterEx, options = {}, current) {
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

      results = await db.query((0, _pandaParchment.merge)(p, options));
      current = _catCurrent(current, results);

      if (!results.LastEvaluatedKey || options.Limit) {
        return current;
      } else {
        return await query(name, keyEx, filterEx, options, current);
      }
    };

    scan = async function (name, filterEx, options = {}, current) {
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

      results = await db.scan((0, _pandaParchment.merge)(p, options));
      current = _catCurrent(current, results);

      if (!results.LastEvaluatedKey || options.Limit) {
        return current;
      } else {
        return await scan(name, filterEx, options, current);
      }
    };

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
      merge: _pandaParchment.merge,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMvZHluYW1vZGIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFLQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFWQTs7OztBQUFBLElBQUEsaUJBQUE7QUFBQSxJQUFBLE9BQUEsR0FBQSxHQUFBLE9BQUE7O0FBWUEsaUJBQUEsR0FBb0IsVUFBQSxHQUFBLEVBQUE7U0FDbEIsVUFBQSxhQUFBLEVBQUE7QUFDRSxRQUFBLGdCQUFBLEVBQUEsV0FBQSxFQUFBLFVBQUEsRUFBQSxhQUFBLEVBQUEsS0FBQSxFQUFBLGlCQUFBLEVBQUEsVUFBQSxFQUFBLFdBQUEsRUFBQSxHQUFBLEVBQUEsYUFBQSxFQUFBLFVBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxVQUFBLEVBQUEsS0FBQSxFQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxXQUFBLEVBQUEsUUFBQSxFQUFBLFVBQUEsRUFBQSxRQUFBLEVBQUEsV0FBQSxFQUFBLG1CQUFBLEVBQUEsaUJBQUEsRUFBQSxFQUFBLEVBQUEsTUFBQTs7QUFBQSxJQUFBLEVBQUEsR0FBSyw4QkFBQSxhQUFBLEVBQWtDLEdBQUcsQ0FBMUMsUUFBSyxDQUFMLENBREYsQzs7OztBQU1FLElBQUEsUUFBQSxHQUFXLGdCQUFBLElBQUEsRUFBQTtBQUNULFVBQUEsS0FBQSxFQUFBLENBQUE7O0FBQUEsVUFBQTtBQUNFLFNBQUE7QUFBQSxVQUFBO0FBQUEsWUFBVSxNQUFNLEVBQUUsQ0FBRixhQUFBLENBQWlCO0FBQUEsVUFBQSxTQUFBLEVBQVc7QUFBWCxTQUFqQixDQUFoQjtlQURGLEs7QUFBQSxPQUFBLENBQUEsT0FBQSxLQUFBLEVBQUE7QUFHTSxRQUFBLENBQUEsR0FBQSxLQUFBO2VBQ0oscUJBQUEsQ0FBQSxFQUFBLEdBQUEsRUFKRiwyQkFJRSxDOztBQUxPLEtBQVg7O0FBT0EsSUFBQSxXQUFBLEdBQWMsZ0JBQUEs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QUFVLFdBQUEsQ0FBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFEOUIsUUFDOEIsQ0FBNUI7QUFERixPQUFBLE1BQUE7QUFHRSxTQUFBO0FBQUEsVUFBQTtBQUFBLFlBSEYsT0FHRTs7O0FBRUYsTUFBQSxDQUFBLEdBQUksRUFBSjs7QUFDQSxVQUFrRCxPQUFPLENBQXpELGdCQUFBLEVBQUE7QUFBQSxRQUFBLENBQUMsQ0FBRCxpQkFBQSxHQUFzQixPQUFPLENBQTdCLGdCQUFBOzs7QUFDQSxNQUFBLE9BQUEsR0FBVSxNQUFNLEVBQUUsQ0FBRixJQUFBLENBQVEsMkJBQUEsQ0FBQSxFQUFkLE9BQWMsQ0FBUixDQUFoQjtBQUVBLE1BQUEsT0FBQSxHQUFVLFdBQUEsQ0FBQSxPQUFBLEVBQUEsT0FBQSxDQUFWOztBQUNBLFVBQUcsQ0FBQyxPQUFPLENBQVIsZ0JBQUEsSUFBNkIsT0FBTyxDQUF2QyxLQUFBLEVBQUE7ZUFBQSxPO0FBQUEsT0FBQSxNQUFBO0FBR0UsZUFBQSxNQUFNLElBQUEsQ0FBQSxJQUFBLEVBQUEsUUFBQSxFQUFBLE9BQUEsRUFIUixPQUdRLENBQU47O0FBZkcsS0FBUDs7V0FtQkE7QUFBQSxNQUFBLFFBQUE7QUFBQSxNQUFBLFdBQUE7QUFBQSxNQUFBLFdBQUE7QUFBQSxNQUFBLFFBQUE7QUFBQSxNQUFBLGlCQUFBO0FBQUEsTUFBQSxtQkFBQTtBQUFBLE1BQUEsVUFBQTtBQUFBLE1BQUEsVUFBQTtBQUFBLE1BQUEsRUFBQTtBQUFBLE1BQUEsS0FBQTtBQUEwSCxNQUFBLEtBQTFILEVBQTBILHFCQUExSDtBQUFBLE1BQUEsR0FBQTtBQUFBLE1BQUEsR0FBQTtBQUFBLE1BQUEsR0FBQTtBQUFBLE1BQUEsRUFBQTtBQUFBLE1BQUEsTUFBQTtBQUFBLE1BQUEsS0FBQTtBQUFBLE1BQUE7QUFBQSxLO0FBM1FGLEc7QUFEa0IsQ0FBcEI7O2VBOFFlLGlCIiwic291cmNlc0NvbnRlbnQiOlsiIyBQcmltaXRpdmVzIGZvciB0aGUgc2VydmljZSBEeW5hbW9EQi5cbiMgVGhlIG1haW4gZW50aXRpZXMgYXJlIFRhYmxlcyBhbmQgSXRlbXMuXG4jIFRoaXMgZm9sbG93cyB0aGUgbmFtaW5nIGNvbnZlbnRpb24gdGhhdCBtZXRob2RzIHRoYXQgd29yayBvbiBUYWJsZXMgd2lsbCBiZVxuIyBwcmVmaXhlZCBcInRhYmxlKlwiLCB3aGVyZWFzIGl0ZW0gbWV0aG9kcyB3aWxsIGhhdmUgbm8gcHJlZml4LlxuXG5pbXBvcnQge2N1cnJ5fSBmcm9tIFwicGFuZGEtZ2FyZGVuXCJcbmltcG9ydCB7bWVyZ2UsIHNsZWVwLCBlbXB0eSwgY2F0LCBkaWZmZXJlbmNlLCBmaXJzdCwga2V5cywgdmFsdWVzLCBpc0Z1bmN0aW9uLCBpc09iamVjdCwgcGlja30gZnJvbSBcInBhbmRhLXBhcmNobWVudFwiXG5pbXBvcnQge01ldGhvZH0gZnJvbSBcInBhbmRhLWdlbmVyaWNzXCJcbmltcG9ydCB7Y29sbGVjdCwgcHJvamVjdH0gZnJvbSBcInBhbmRhLXJpdmVyXCJcbmltcG9ydCB7bm90Rm91bmR9IGZyb20gXCIuL3V0aWxzXCJcbmltcG9ydCB7YXBwbHlDb25maWd1cmF0aW9ufSBmcm9tIFwiLi4vbGlmdFwiXG5cbmR5bmFtb2RiUHJpbWl0aXZlID0gKFNESykgLT5cbiAgKGNvbmZpZ3VyYXRpb24pIC0+XG4gICAgZGIgPSBhcHBseUNvbmZpZ3VyYXRpb24gY29uZmlndXJhdGlvbiwgU0RLLkR5bmFtb0RCXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgIyBUYWJsZXNcbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgdGFibGVHZXQgPSAobmFtZSkgLT5cbiAgICAgIHRyeVxuICAgICAgICB7VGFibGV9ID0gYXdhaXQgZGIuZGVzY3JpYmVUYWJsZSBUYWJsZU5hbWU6IG5hbWVcbiAgICAgICAgVGFibGVcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgbm90Rm91bmQgZSwgNDAwLCBcIlJlc291cmNlTm90Rm91bmRFeGNlcHRpb25cIlxuXG4gICAgdGFibGVDcmVhdGUgPSAobmFtZSwga2V5cywgYXR0cmlidXRlcywgdGhyb3VnaHB1dCwgb3B0aW9ucz17fSkgLT5cbiAgICAgIHAgPVxuICAgICAgICBUYWJsZU5hbWU6IG5hbWVcbiAgICAgICAgS2V5U2NoZW1hOiBrZXlzXG4gICAgICAgIEF0dHJpYnV0ZURlZmluaXRpb25zOiBhdHRyaWJ1dGVzXG4gICAgICAgIFByb3Zpc2lvbmVkVGhyb3VnaHB1dDogdGhyb3VnaHB1dFxuXG4gICAgICB7VGFibGVEZXNjcmlwdGlvbn09IGF3YWl0IGRiLmNyZWF0ZVRhYmxlIG1lcmdlIHAsIG9wdGlvbnNcbiAgICAgIFRhYmxlRGVzY3JpcHRpb25cblxuICAgIHRhYmxlVXBkYXRlID0gKG5hbWUsIGF0dHJpYnV0ZXMsIHRocm91Z2hwdXQsIG9wdGlvbnM9e30pIC0+XG4gICAgICBwID1cbiAgICAgICAgVGFibGVOYW1lOiBuYW1lXG4gICAgICAgIEF0dHJpYnV0ZURlZmluaXRpb25zOiBhdHRyaWJ1dGVzXG4gICAgICBwLlByb3Zpc2lvbmVkVGhyb3VnaHB1dCA9IHRocm91Z2hwdXQgaWYgdGhyb3VnaHB1dFxuXG4gICAgICB7VGFibGVEZXNjcmlwdGlvbn09IGF3YWl0IGRiLnVwZGF0ZVRhYmxlIG1lcmdlIHAsIG9wdGlvbnNcbiAgICAgIFRhYmxlRGVzY3JpcHRpb25cblxuICAgIHRhYmxlRGVsID0gKG5hbWUpIC0+XG4gICAgICB0cnlcbiAgICAgICAgYXdhaXQgZGIuZGVsZXRlVGFibGUgVGFibGVOYW1lOiBuYW1lXG4gICAgICBjYXRjaCBlXG4gICAgICAgIG5vdEZvdW5kIGVcblxuXG4gICAgX2lzVGFibGVSZWFkeSA9IChuYW1lKSAtPlxuICAgICAgd2hpbGUgdHJ1ZVxuICAgICAgICB7VGFibGVTdGF0dXN9ID0gYXdhaXQgdGFibGVHZXQgbmFtZVxuICAgICAgICBpZiAhVGFibGVTdGF0dXNcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJDYW5ub3QgZmluZCB0YWJsZSAje25hbWV9XCJcbiAgICAgICAgZWxzZSBpZiBUYWJsZVN0YXR1cyAhPSBcIkFDVElWRVwiXG4gICAgICAgICAgYXdhaXQgc2xlZXAgNTAwMFxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIHRydWVcblxuICAgIF9hcmVJbmRleGVzUmVhZHkgPSAobmFtZSkgLT5cbiAgICAgIHdoaWxlIHRydWVcbiAgICAgICAge0dsb2JhbFNlY29uZGFyeUluZGV4ZXM6IGluZGV4ZXN9ID0gYXdhaXQgdGFibGVHZXQgbmFtZVxuICAgICAgICByZXR1cm4gdHJ1ZSBpZiAhaW5kZXhlc1xuICAgICAgICBzdGF0dXNlcyA9IGNvbGxlY3QgcHJvamVjdCBcIkluZGV4U3RhdHVzXCIsIGluZGV4ZXNcbiAgICAgICAgaWYgZW1wdHkgZGlmZmVyZW5jZSBzdGF0dXNlcywgW1wiQUNUSVZFXCJdXG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF3YWl0IHNsZWVwIDUwMDBcblxuICAgICMgVGhlIG9wdGlvbmFsIHNlY29uZCBwYXJhbWV0ZXIgYWxsb3dzIHRoZSBkZXZlbG9wZXIgdG8gYWxzbyB3YWl0IG9uIGFsbCBnbG9iYWwgc2Vjb25kYXJ5IGluZGV4ZXMgdG8gYWxzbyBiZSByZWFkeS5cbiAgICB0YWJsZVdhaXRGb3JSZWFkeSA9IChuYW1lLCBpbmRleFdhaXQpIC0+XG4gICAgICBjaGVja3MgPSBbX2lzVGFibGVSZWFkeSBuYW1lXVxuICAgICAgY2hlY2tzLnB1c2ggX2FyZUluZGV4ZXNSZWFkeSBuYW1lIGlmIGluZGV4V2FpdFxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwgY2hlY2tzXG5cbiAgICB0YWJsZVdhaXRGb3JEZWxldGVkID0gKG5hbWUpIC0+XG4gICAgICB3aGlsZSB0cnVlXG4gICAgICAgIHtUYWJsZVN0YXR1c30gPSBhd2FpdCB0YWJsZUdldCBuYW1lXG4gICAgICAgIGlmICFUYWJsZVN0YXR1c1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBhd2FpdCBzbGVlcCA1MDAwXG5cbiAgICAjIFRPRE86IG1ha2UgdGhpcyBtb3JlIGVmZmljaWVudCBieSB0aHJvdHRsaW5nIHRvIFggY29ubmVjdGlvbnMgYXQgb25jZS4gQVdTXG4gICAgIyBvbmx5IHN1cHBvcnRzIE4gcmVxdWVzdHMgcGVyIHNlY29uZCBmcm9tIGFuIGFjY291bnQsIGFuZCBJIGRvbid0IHdhbnQgdGhpc1xuICAgICMgdG8gdmlvbGF0ZSB0aGF0IGxpbWl0LCBidXQgd2UgY2FuIGRvIGJldHRlciB0aGFuIG9uZSBhdCBhIHRpbWUuXG4gICAga2V5c0ZpbHRlciA9IGN1cnJ5IChrZXlzLCBpdGVtKSAtPlxuICAgICAgZiA9IChrZXkpIC0+IGtleSBpbiBrZXlzXG4gICAgICBwaWNrIGYsIGl0ZW1cblxuICAgIHRhYmxlRW1wdHkgPSAobmFtZSkgLT5cbiAgICAgIHtLZXlTY2hlbWF9ID0gYXdhaXQgdGFibGVHZXQgbmFtZVxuICAgICAgZmlsdGVyID0ga2V5c0ZpbHRlciBjb2xsZWN0IHByb2plY3QgXCJBdHRyaWJ1dGVOYW1lXCIsIEtleVNjaGVtYVxuXG4gICAgICB7SXRlbXN9ID0gYXdhaXQgc2NhbiBuYW1lXG4gICAgICBhd2FpdCBkZWwgbmFtZSwgZmlsdGVyKGkpIGZvciBpIGluIEl0ZW1zXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgIyBUeXBlIEhlbHBlcnNcbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgIyBEeW5hbW9EQiBpbmNsdWRlcyB0eXBlIGluZm9ybWF0aW9uIG1hcHBlZCBpbnRvIGl0cyBkYXRhIHN0cmN0dXJlcy5cbiAgICAjIEl0IGV4cGVjdHMgZGF0YSB0byBiZSBpbnB1dCB0aGF0IHdheSwgYW5kIGluY2x1ZGVzIGl0IHdoZW4gZmV0Y2hlZC5cbiAgICAjIFRoZXNlIGhlbHBlcnMgd3JpdGUgYW5kIHBhcnNlIHRoYXQgdHlwZSBzeXN0ZW0uXG4gICAgX3RyYW5zZm9ybSA9IChmKSAtPlxuICAgICAgKHgpIC0+XG4gICAgICAgIGlmIGlzT2JqZWN0IHhcbiAgICAgICAgICBvdXQgPSB7fVxuICAgICAgICAgIG91dFtrXSA9IF9tYXJrKFwiYW55b255bW91c0R5bmFtb2RiVmFsdWVcIiwgZiB2KSBmb3IgaywgdiBvZiB4XG4gICAgICAgICAgX21hcmsgXCJuYW1lZER5bmFtb2RiVmFsdWVcIiwgb3V0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfbWFyayBcImFueW9ueW1vdXNEeW5hbW9kYlZhbHVlXCIsIGYgeFxuXG4gICAgX21hcmsgPSAobmFtZSwgb2JqZWN0KSAtPiBPYmplY3QuZGVmaW5lUHJvcGVydHkgb2JqZWN0LCBcIm5hbWVcIiwgdmFsdWU6IG5hbWVcblxuICAgIHRvID1cbiAgICAgIFM6IF90cmFuc2Zvcm0gKHMpIC0+IFM6IHMudG9TdHJpbmcoKVxuICAgICAgTjogX3RyYW5zZm9ybSAobikgLT4gTjogbi50b1N0cmluZygpXG4gICAgICBCOiBfdHJhbnNmb3JtIChiKSAtPiBCOiBiLnRvU3RyaW5nKFwiYmFzZTY0XCIpXG4gICAgICBTUzogX3RyYW5zZm9ybSAoYSkgLT4gU1M6IChpLnRvU3RyaW5nKCkgZm9yIGkgaW4gYSlcbiAgICAgIE5TOiBfdHJhbnNmb3JtIChhKSAtPiBOUzogKGkudG9TdHJpbmcoKSBmb3IgaSBpbiBhKVxuICAgICAgQlM6IF90cmFuc2Zvcm0gKGEpIC0+IEJTOiAoaS50b1N0cmluZyhcImJhc2U2NFwiKSBmb3IgaSBpbiBhKVxuICAgICAgTTogX3RyYW5zZm9ybSAobSkgLT4gTTogbVxuICAgICAgTDogX3RyYW5zZm9ybSAobCkgLT4gTDogbFxuICAgICAgTnVsbDogX3RyYW5zZm9ybSAobikgLT4gTlVMTDogblxuICAgICAgQm9vbDogX3RyYW5zZm9ybSAoYikgLT4gQk9PTDogYlxuXG4gICAgcGFyc2UgPSAoYXR0cmlidXRlcykgLT5cbiAgICAgIHJlc3VsdCA9IHt9XG4gICAgICBmb3IgbmFtZSwgdHlwZU9iaiBvZiBhdHRyaWJ1dGVzXG4gICAgICAgIGRhdGFUeXBlID0gZmlyc3Qga2V5cyB0eXBlT2JqXG4gICAgICAgIHYgPSBmaXJzdCB2YWx1ZXMgdHlwZU9ialxuICAgICAgICByZXN1bHRbbmFtZV0gPSBzd2l0Y2ggZGF0YVR5cGVcbiAgICAgICAgICB3aGVuIFwiU1wiLCBcIlNTXCIsIFwiTFwiLCBcIkJPT0xcIiB0aGVuIHZcbiAgICAgICAgICB3aGVuIFwiTlwiIHRoZW4gbmV3IE51bWJlciB2XG4gICAgICAgICAgd2hlbiBcIkJcIiB0aGVuIEJ1ZmZlci5mcm9tIHYsIFwiYmFzZTY0XCJcbiAgICAgICAgICB3aGVuIFwiTlNcIiB0aGVuIChuZXcgTnVtYmVyIGkgZm9yIGkgaW4gdilcbiAgICAgICAgICB3aGVuIFwiQlNcIiB0aGVuIChCdWZmZXIuZnJvbSBpLCBcImJhc2U2NFwiIGZvciBpIGluIHYpXG4gICAgICAgICAgd2hlbiBcIk5VTExcIlxuICAgICAgICAgICAgaWYgdiB0aGVuIG51bGwgZWxzZSB1bmRlZmluZWRcbiAgICAgICAgICB3aGVuIFwiTVwiIHRoZW4gcGFyc2UgdlxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIlVuYWJsZSB0byBwYXJzZSBvYmplY3QgZm9yIER5bmFtb0RCIGF0dHJpYnV0ZSB0eXBlLiAje2RhdGFUeXBlfVwiXG4gICAgICByZXN1bHRcblxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICMgSXRlbXNcbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgZ2V0ID0gKG5hbWUsIGtleSwgb3B0aW9ucz17fSkgLT5cbiAgICAgIHtSZXR1cm5Db25zdW1lZENhcGFjaXR5fSA9IG9wdGlvbnNcbiAgICAgIHAgPSB7VGFibGVOYW1lOiBuYW1lLCBLZXk6IGtleX1cbiAgICAgIHtJdGVtLCBDb25zdW1lZENhcGFjaXR5fSA9IGF3YWl0IGRiLmdldEl0ZW0gbWVyZ2UgcCwgb3B0aW9uc1xuICAgICAgaWYgUmV0dXJuQ29uc3VtZWRDYXBhY2l0eSB0aGVuIHtJdGVtLCBDb25zdW1lZENhcGFjaXR5fSBlbHNlIEl0ZW1cblxuICAgIHB1dCA9IChuYW1lLCBpdGVtLCBvcHRpb25zPXt9KSAtPlxuICAgICAgcCA9IHtUYWJsZU5hbWU6IG5hbWUsIEl0ZW06IGl0ZW19XG4gICAgICBhd2FpdCBkYi5wdXRJdGVtIG1lcmdlIHAsIG9wdGlvbnNcblxuICAgIGRlbCA9IChuYW1lLCBrZXksIG9wdGlvbnM9e30pIC0+XG4gICAgICBwID0ge1RhYmxlTmFtZTogbmFtZSwgS2V5OiBrZXl9XG4gICAgICBhd2FpdCBkYi5kZWxldGVJdGVtIG1lcmdlIHAsIG9wdGlvbnNcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAjIFF1ZXJpZXMgYW5kIFNjYW5zIGFnYWluc3QgVGFibGVzIGFuZCBJbmRleGVzXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIF9kZWxpbWl0ZXIgPSBcIjwjIyNTVU5ET0dEWU5BTU9EQiMjIz5cIlxuICAgIF9zZXR1cEN1cnJlbnQgPSAtPlxuICAgICAgSXRlbXM6IFtdXG4gICAgICBDb3VudDogMFxuICAgICAgU2Nhbm5lZENvdW50OiAwXG4gICAgICBMYXN0RXZhbHVhdGVkS2V5OiBmYWxzZVxuICAgICAgQ29uc3VtZWRDYXBhY2l0eTogW11cblxuICAgIF9jYXRDdXJyZW50ID0gKGN1cnJlbnQsIHJlc3VsdHMpIC0+XG4gICAgICB7SXRlbXMsIENvdW50LCBTY2FubmVkQ291bnQsIExhc3RFdmFsdWF0ZWRLZXksIENvbnN1bWVkQ2FwYWNpdHl9ID0gcmVzdWx0c1xuICAgICAgY3VycmVudC5JdGVtcyA9IGNhdCBjdXJyZW50Lkl0ZW1zLCBJdGVtc1xuICAgICAgY3VycmVudC5Db3VudCArPSBDb3VudFxuICAgICAgY3VycmVudC5TY2FubmVkQ291bnQgKz0gU2Nhbm5lZENvdW50XG4gICAgICBjdXJyZW50Lkxhc3RFdmFsdWF0ZWRLZXkgPSBMYXN0RXZhbHVhdGVkS2V5IGlmIExhc3RFdmFsdWF0ZWRLZXlcbiAgICAgIGN1cnJlbnQuQ29uc3VtZWRDYXBhY2l0eSA9IGN1cnJlbnQuQ29uc3VtZWRDYXBhY2l0eS5wdXNoIENvbnN1bWVkQ2FwYWNpdHlcbiAgICAgIGN1cnJlbnRcblxuICAgIF9wYXJzZU5hbWUgPSAobmFtZSkgLT5cbiAgICAgIHRocm93IG5ldyBFcnJvciBcIk11c3QgcHJvdmlkZSB0YWJsZSBuYW1lLlwiIGlmICFuYW1lXG4gICAgICBwYXJ0cyA9IG5hbWUuc3BsaXQgXCI6XCJcbiAgICAgIGlmIHBhcnRzLmxlbmd0aCA+IDFcbiAgICAgICAge3RhYmxlTmFtZTogcGFydHNbMF0sIGluZGV4TmFtZTogcGFydHNbMV19XG4gICAgICBlbHNlXG4gICAgICAgIHt0YWJsZU5hbWU6IG5hbWUsIGluZGV4TmFtZTogZmFsc2V9XG5cbiAgICBfcGFyc2VDb25kaXRpb25hbCA9IChleCwgY291bnQ9MCkgLT5cbiAgICAgIHJldHVybiB7cmVzdWx0OmZhbHNlLCB2YWx1ZXM6ZmFsc2UsIGNvdW50fSBpZiAhZXhcbiAgICAgIFZhbHVlcyA9IHt9XG4gICAgICByZSA9IG5ldyBSZWdFeHAgXCIje19kZWxpbWl0ZXJ9Lis/I3tfZGVsaW1pdGVyfVwiLCBcImdcIlxuXG4gICAgICByZXN1bHQgPSBleC5yZXBsYWNlIHJlLCAobWF0Y2gpIC0+XG4gICAgICAgIFssIG9ial0gPSBtYXRjaC5zcGxpdCBfZGVsaW1pdGVyXG4gICAgICAgIHBsYWNlaG9sZGVyID0gXCI6cGFyYW0je2NvdW50fVwiXG4gICAgICAgIGNvdW50KytcbiAgICAgICAgVmFsdWVzW3BsYWNlaG9sZGVyXSA9IEpTT04ucGFyc2Ugb2JqXG4gICAgICAgIHBsYWNlaG9sZGVyICMgUmV0dXJuIHBsYWNlaG9sZGVyIHRvIHRoZSBleHByZXNzaW9uIHdlIGFyZSBwcm9jZXNzaW5nLlxuXG4gICAgICB7cmVzdWx0LCB2YWx1ZXM6VmFsdWVzLCBjb3VudH1cblxuICAgIF9wYXJzZVF1ZXJ5ID0gKG9wdGlvbnMsIG5hbWUsIGtleUV4LCBmaWx0ZXJFeCkgLT5cbiAgICAgIHt0YWJsZU5hbWUsIGluZGV4TmFtZX0gPSBfcGFyc2VOYW1lIG5hbWVcbiAgICAgIHtyZXN1bHQ6a2V5LCB2YWx1ZXM6a2V5VmFsdWVzLCBjb3VudH0gPSBfcGFyc2VDb25kaXRpb25hbCBrZXlFeFxuICAgICAge3Jlc3VsdDpmaWx0ZXIsIHZhbHVlczpmaWx0ZXJWYWx1ZXN9ID0gX3BhcnNlQ29uZGl0aW9uYWwgZmlsdGVyRXgsIGNvdW50XG5cbiAgICAgIG91dCA9IG9wdGlvbnNcbiAgICAgIG91dC5UYWJsZU5hbWUgPSB0YWJsZU5hbWVcbiAgICAgIG91dC5JbmRleE5hbWUgPSBpbmRleE5hbWUgaWYgaW5kZXhOYW1lXG4gICAgICBvdXQuS2V5Q29uZGl0aW9uRXhwcmVzc2lvbiA9IGtleSBpZiBrZXlcbiAgICAgIG91dC5GaWx0ZXJFeHByZXNzaW9uID0gZmlsdGVyIGlmIGZpbHRlclxuICAgICAgaWYga2V5VmFsdWVzIHx8IGZpbHRlclZhbHVlc1xuICAgICAgICBvdXQuRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlcyA9XG4gICAgICAgICAgbWVyZ2UgKGtleVZhbHVlcyB8fCB7fSksIChmaWx0ZXJWYWx1ZXMgfHwge30pXG4gICAgICBvdXRcblxuICAgICMgcXYgcHJvZHVjZXMgcXVlcnkgc3RyaW5ncyB3aXRoIGRlbGltaXRlZCB2YWx1ZXMgU3VuRG9nIGNhbiBwYXJzZS5cbiAgICBfcXYgPSAobykgLT5cbiAgICAgIGRlbGltaXQgPSAocykgLT4gXCIje19kZWxpbWl0ZXJ9I3tzfSN7X2RlbGltaXRlcn1cIlxuICAgICAgIyBEZXRlcm1pbmUgaWYgdGhpcyBpcyBhIER5bmFtb0RCIHZhbHVlLCBhbmQgd2hldGhlciBpcyBhbnlvbnltb3VzIG9yIG5hbWVkLlxuICAgICAgaWYgby5uYW1lID09IFwiYW55b255bW91c0R5bmFtb2RiVmFsdWVcIlxuICAgICAgICBkZWxpbWl0IEpTT04uc3RyaW5naWZ5IG9cbiAgICAgIGVsc2UgaWYgby5uYW1lID09IFwibmFtZWREeW5hbW9kYlZhbHVlXCJcbiAgICAgICAgZGVsaW1pdCBKU09OLnN0cmluZ2lmeSBmaXJzdCB2YWx1ZXMgb1xuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJVbmFibGUgdG8gY3JlYXRlIHN0cmluZ2lmaWVkIHF1ZXJ5IHZhbHVlIGZvciB1bnJlY29uZ2llZCBvYmplY3QgI3tKU09OLnN0cmluZ2lmeSBvfVwiXG5cbiAgICBxdiA9IE1ldGhvZC5jcmVhdGUoKVxuICAgIE1ldGhvZC5kZWZpbmUgcXYsIGlzRnVuY3Rpb24sIChmKSAtPiAoeCkgLT4gX3F2IGYgeFxuICAgIE1ldGhvZC5kZWZpbmUgcXYsIGlzT2JqZWN0LCAobykgLT4gX3F2IG9cblxuICAgIHVwZGF0ZSA9IChuYW1lLCBrZXksIHVwZGF0ZUV4LCBvcHRpb25zPXt9KSAtPlxuICAgICAgcCA9IHtUYWJsZU5hbWU6IG5hbWUsIEtleToga2V5fVxuICAgICAge3Jlc3VsdCwgdmFsdWVzOl92YWx1ZXN9ID0gX3BhcnNlQ29uZGl0aW9uYWwgdXBkYXRlRXhcbiAgICAgIG9wdGlvbnMuVXBkYXRlRXhwcmVzc2lvbiA9IHJlc3VsdCBpZiByZXN1bHRcbiAgICAgIG9wdGlvbnMuRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlcyA9IF92YWx1ZXMgaWYgX3ZhbHVlc1xuICAgICAgYXdhaXQgZGIudXBkYXRlSXRlbSBtZXJnZSBwLCBvcHRpb25zXG5cbiAgICBxdWVyeSA9IChuYW1lLCBrZXlFeCwgZmlsdGVyRXgsIG9wdGlvbnM9e30sIGN1cnJlbnQpIC0+XG4gICAgICBjdXJyZW50ID0gX3NldHVwQ3VycmVudCgpIGlmICFjdXJyZW50XG4gICAgICBpZiAhY3VycmVudC5vcHRpb25zXG4gICAgICAgIGN1cnJlbnQub3B0aW9ucyA9IG9wdGlvbnMgPSBfcGFyc2VRdWVyeSBvcHRpb25zLCBuYW1lLCBrZXlFeCwgZmlsdGVyRXhcbiAgICAgIGVsc2VcbiAgICAgICAge29wdGlvbnN9ID0gY3VycmVudFxuXG4gICAgICBwID0ge31cbiAgICAgIHAuRXhjbHVzaXZlU3RhcnRLZXkgPSBjdXJyZW50Lkxhc3RFdmFsdWF0ZWRLZXkgaWYgY3VycmVudC5MYXN0RXZhbHVhdGVkS2V5XG4gICAgICByZXN1bHRzID0gYXdhaXQgZGIucXVlcnkgbWVyZ2UgcCwgb3B0aW9uc1xuXG4gICAgICBjdXJyZW50ID0gX2NhdEN1cnJlbnQgY3VycmVudCwgcmVzdWx0c1xuICAgICAgaWYgIXJlc3VsdHMuTGFzdEV2YWx1YXRlZEtleSB8fCBvcHRpb25zLkxpbWl0XG4gICAgICAgIGN1cnJlbnRcbiAgICAgIGVsc2VcbiAgICAgICAgYXdhaXQgcXVlcnkgbmFtZSwga2V5RXgsIGZpbHRlckV4LCBvcHRpb25zLCBjdXJyZW50XG5cbiAgICBzY2FuID0gKG5hbWUsIGZpbHRlckV4LCBvcHRpb25zPXt9LCBjdXJyZW50KSAtPlxuICAgICAgY3VycmVudCA9IF9zZXR1cEN1cnJlbnQoKSBpZiAhY3VycmVudFxuICAgICAgaWYgIWN1cnJlbnQub3B0aW9uc1xuICAgICAgICBjdXJyZW50Lm9wdGlvbnMgPSBvcHRpb25zID0gX3BhcnNlUXVlcnkgb3B0aW9ucywgbmFtZSwgZmFsc2UsIGZpbHRlckV4XG4gICAgICBlbHNlXG4gICAgICAgIHtvcHRpb25zfSA9IGN1cnJlbnRcblxuICAgICAgcCA9IHt9XG4gICAgICBwLkV4Y2x1c2l2ZVN0YXJ0S2V5ID0gY3VycmVudC5MYXN0RXZhbHVhdGVkS2V5IGlmIGN1cnJlbnQuTGFzdEV2YWx1YXRlZEtleVxuICAgICAgcmVzdWx0cyA9IGF3YWl0IGRiLnNjYW4gbWVyZ2UgcCwgb3B0aW9uc1xuXG4gICAgICBjdXJyZW50ID0gX2NhdEN1cnJlbnQgY3VycmVudCwgcmVzdWx0c1xuICAgICAgaWYgIXJlc3VsdHMuTGFzdEV2YWx1YXRlZEtleSB8fCBvcHRpb25zLkxpbWl0XG4gICAgICAgIGN1cnJlbnRcbiAgICAgIGVsc2VcbiAgICAgICAgYXdhaXQgc2NhbiBuYW1lLCBmaWx0ZXJFeCwgb3B0aW9ucywgY3VycmVudFxuXG5cblxuICAgIHt0YWJsZUdldCwgdGFibGVDcmVhdGUsIHRhYmxlVXBkYXRlLCB0YWJsZURlbCwgdGFibGVXYWl0Rm9yUmVhZHksIHRhYmxlV2FpdEZvckRlbGV0ZWQsIHRhYmxlRW1wdHksIGtleXNGaWx0ZXIsIHRvLCBwYXJzZSwgbWVyZ2UsIGdldCwgcHV0LCBkZWwsIHF2LCB1cGRhdGUsIHF1ZXJ5LCBzY2FufVxuXG5leHBvcnQgZGVmYXVsdCBkeW5hbW9kYlByaW1pdGl2ZVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=primitives/dynamodb.coffee