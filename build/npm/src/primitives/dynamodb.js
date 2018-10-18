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
      var p, result;
      p = {
        TableName: name,
        Key: key
      };
      ({
        result,
        values: _pandaParchment.values
      } = _parseConditional(updateEx));

      if (result) {
        options.UpdateExpression = result;
      }

      if (_pandaParchment.values) {
        options.ExpressionAttributeValues = _pandaParchment.values;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMvZHluYW1vZGIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFLQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFWQTs7OztBQUFBLElBQUEsaUJBQUE7QUFBQSxJQUFBLE9BQUEsR0FBQSxHQUFBLE9BQUE7O0FBWUEsaUJBQUEsR0FBb0IsVUFBQSxHQUFBLEVBQUE7U0FDbEIsVUFBQSxhQUFBLEVBQUE7QUFDRSxRQUFBLGdCQUFBLEVBQUEsV0FBQSxFQUFBLFVBQUEsRUFBQSxhQUFBLEVBQUEsS0FBQSxFQUFBLGlCQUFBLEVBQUEsVUFBQSxFQUFBLFdBQUEsRUFBQSxHQUFBLEVBQUEsYUFBQSxFQUFBLFVBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxVQUFBLEVBQUEsS0FBQSxFQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxXQUFBLEVBQUEsUUFBQSxFQUFBLFVBQUEsRUFBQSxRQUFBLEVBQUEsV0FBQSxFQUFBLG1CQUFBLEVBQUEsaUJBQUEsRUFBQSxFQUFBLEVBQUEsTUFBQTs7QUFBQSxJQUFBLEVBQUEsR0FBSyw4QkFBQSxhQUFBLEVBQWtDLEdBQUcsQ0FBMUMsUUFBSyxDQUFMLENBREYsQzs7OztBQU1FLElBQUEsUUFBQSxHQUFXLGdCQUFBLElBQUEsRUFBQTtBQUNULFVBQUEsS0FBQSxFQUFBLENBQUE7O0FBQUEsVUFBQTtBQUNFLFNBQUE7QUFBQSxVQUFBO0FBQUEsWUFBVSxNQUFNLEVBQUUsQ0FBRixhQUFBLENBQWlCO0FBQUEsVUFBQSxTQUFBLEVBQVc7QUFBWCxTQUFqQixDQUFoQjtlQURGLEs7QUFBQSxPQUFBLENBQUEsT0FBQSxLQUFBLEVBQUE7QUFHTSxRQUFBLENBQUEsR0FBQSxLQUFBO2VBQ0oscUJBQUEsQ0FBQSxFQUFBLEdBQUEsRUFKRiwyQkFJRSxDOztBQUxPLEtBQVg7O0FBT0EsSUFBQSxXQUFBLEdBQWMsZ0JBQUEs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QUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxFQUQ5QixRQUM4QixDQUE1QjtBQURGLE9BQUEsTUFBQTtBQUdFLFNBQUE7QUFBQSxVQUFBO0FBQUEsWUFIRixPQUdFOzs7QUFFRixNQUFBLENBQUEsR0FBSSxFQUFKOztBQUNBLFVBQWtELE9BQU8sQ0FBekQsZ0JBQUEsRUFBQTtBQUFBLFFBQUEsQ0FBQyxDQUFELGlCQUFBLEdBQXNCLE9BQU8sQ0FBN0IsZ0JBQUE7OztBQUNBLE1BQUEsT0FBQSxHQUFVLE1BQU0sRUFBRSxDQUFGLElBQUEsQ0FBUSwyQkFBQSxDQUFBLEVBQWQsT0FBYyxDQUFSLENBQWhCO0FBRUEsTUFBQSxPQUFBLEdBQVUsV0FBQSxDQUFBLE9BQUEsRUFBQSxPQUFBLENBQVY7O0FBQ0EsVUFBRyxDQUFDLE9BQU8sQ0FBUixnQkFBQSxJQUE2QixPQUFPLENBQXZDLEtBQUEsRUFBQTtlQUFBLE87QUFBQSxPQUFBLE1BQUE7QUFHRSxlQUFBLE1BQU0sSUFBQSxDQUFBLElBQUEsRUFBQSxRQUFBLEVBQUEsT0FBQSxFQUhSLE9BR1EsQ0FBTjs7QUFmRyxLQUFQOztXQW1CQTtBQUFBLE1BQUEsUUFBQTtBQUFBLE1BQUEsV0FBQTtBQUFBLE1BQUEsV0FBQTtBQUFBLE1BQUEsUUFBQTtBQUFBLE1BQUEsaUJBQUE7QUFBQSxNQUFBLG1CQUFBO0FBQUEsTUFBQSxVQUFBO0FBQUEsTUFBQSxVQUFBO0FBQUEsTUFBQSxFQUFBO0FBQUEsTUFBQSxLQUFBO0FBQTBILE1BQUEsS0FBMUgsRUFBMEgscUJBQTFIO0FBQUEsTUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBO0FBQUEsTUFBQSxFQUFBO0FBQUEsTUFBQSxNQUFBO0FBQUEsTUFBQSxLQUFBO0FBQUEsTUFBQTtBQUFBLEs7QUEzUUYsRztBQURrQixDQUFwQjs7ZUE4UWUsaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIFByaW1pdGl2ZXMgZm9yIHRoZSBzZXJ2aWNlIER5bmFtb0RCLlxuIyBUaGUgbWFpbiBlbnRpdGllcyBhcmUgVGFibGVzIGFuZCBJdGVtcy5cbiMgVGhpcyBmb2xsb3dzIHRoZSBuYW1pbmcgY29udmVudGlvbiB0aGF0IG1ldGhvZHMgdGhhdCB3b3JrIG9uIFRhYmxlcyB3aWxsIGJlXG4jIHByZWZpeGVkIFwidGFibGUqXCIsIHdoZXJlYXMgaXRlbSBtZXRob2RzIHdpbGwgaGF2ZSBubyBwcmVmaXguXG5cbmltcG9ydCB7Y3Vycnl9IGZyb20gXCJwYW5kYS1nYXJkZW5cIlxuaW1wb3J0IHttZXJnZSwgc2xlZXAsIGVtcHR5LCBjYXQsIGRpZmZlcmVuY2UsIGZpcnN0LCBrZXlzLCB2YWx1ZXMsIGlzRnVuY3Rpb24sIGlzT2JqZWN0LCBwaWNrfSBmcm9tIFwicGFuZGEtcGFyY2htZW50XCJcbmltcG9ydCB7TWV0aG9kfSBmcm9tIFwicGFuZGEtZ2VuZXJpY3NcIlxuaW1wb3J0IHtjb2xsZWN0LCBzZWxlY3QsIHByb2plY3R9IGZyb20gXCJwYW5kYS1yaXZlclwiXG5pbXBvcnQge25vdEZvdW5kfSBmcm9tIFwiLi91dGlsc1wiXG5pbXBvcnQge2FwcGx5Q29uZmlndXJhdGlvbn0gZnJvbSBcIi4uL2xpZnRcIlxuXG5keW5hbW9kYlByaW1pdGl2ZSA9IChTREspIC0+XG4gIChjb25maWd1cmF0aW9uKSAtPlxuICAgIGRiID0gYXBwbHlDb25maWd1cmF0aW9uIGNvbmZpZ3VyYXRpb24sIFNESy5EeW5hbW9EQlxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICMgVGFibGVzXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIHRhYmxlR2V0ID0gKG5hbWUpIC0+XG4gICAgICB0cnlcbiAgICAgICAge1RhYmxlfSA9IGF3YWl0IGRiLmRlc2NyaWJlVGFibGUgVGFibGVOYW1lOiBuYW1lXG4gICAgICAgIFRhYmxlXG4gICAgICBjYXRjaCBlXG4gICAgICAgIG5vdEZvdW5kIGUsIDQwMCwgXCJSZXNvdXJjZU5vdEZvdW5kRXhjZXB0aW9uXCJcblxuICAgIHRhYmxlQ3JlYXRlID0gKG5hbWUsIGtleXMsIGF0dHJpYnV0ZXMsIHRocm91Z2hwdXQsIG9wdGlvbnM9e30pIC0+XG4gICAgICBwID1cbiAgICAgICAgVGFibGVOYW1lOiBuYW1lXG4gICAgICAgIEtleVNjaGVtYToga2V5c1xuICAgICAgICBBdHRyaWJ1dGVEZWZpbml0aW9uczogYXR0cmlidXRlc1xuICAgICAgICBQcm92aXNpb25lZFRocm91Z2hwdXQ6IHRocm91Z2hwdXRcblxuICAgICAge1RhYmxlRGVzY3JpcHRpb259PSBhd2FpdCBkYi5jcmVhdGVUYWJsZSBtZXJnZSBwLCBvcHRpb25zXG4gICAgICBUYWJsZURlc2NyaXB0aW9uXG5cbiAgICB0YWJsZVVwZGF0ZSA9IChuYW1lLCBhdHRyaWJ1dGVzLCB0aHJvdWdocHV0LCBvcHRpb25zPXt9KSAtPlxuICAgICAgcCA9XG4gICAgICAgIFRhYmxlTmFtZTogbmFtZVxuICAgICAgICBBdHRyaWJ1dGVEZWZpbml0aW9uczogYXR0cmlidXRlc1xuICAgICAgcC5Qcm92aXNpb25lZFRocm91Z2hwdXQgPSB0aHJvdWdocHV0IGlmIHRocm91Z2hwdXRcblxuICAgICAge1RhYmxlRGVzY3JpcHRpb259PSBhd2FpdCBkYi51cGRhdGVUYWJsZSBtZXJnZSBwLCBvcHRpb25zXG4gICAgICBUYWJsZURlc2NyaXB0aW9uXG5cbiAgICB0YWJsZURlbCA9IChuYW1lKSAtPlxuICAgICAgdHJ5XG4gICAgICAgIGF3YWl0IGRiLmRlbGV0ZVRhYmxlIFRhYmxlTmFtZTogbmFtZVxuICAgICAgY2F0Y2ggZVxuICAgICAgICBub3RGb3VuZCBlXG5cblxuICAgIF9pc1RhYmxlUmVhZHkgPSAobmFtZSkgLT5cbiAgICAgIHdoaWxlIHRydWVcbiAgICAgICAge1RhYmxlU3RhdHVzfSA9IGF3YWl0IHRhYmxlR2V0IG5hbWVcbiAgICAgICAgaWYgIVRhYmxlU3RhdHVzXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiQ2Fubm90IGZpbmQgdGFibGUgI3tuYW1lfVwiXG4gICAgICAgIGVsc2UgaWYgVGFibGVTdGF0dXMgIT0gXCJBQ1RJVkVcIlxuICAgICAgICAgIGF3YWl0IHNsZWVwIDUwMDBcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiB0cnVlXG5cbiAgICBfYXJlSW5kZXhlc1JlYWR5ID0gKG5hbWUpIC0+XG4gICAgICB3aGlsZSB0cnVlXG4gICAgICAgIHtHbG9iYWxTZWNvbmRhcnlJbmRleGVzOiBpbmRleGVzfSA9IGF3YWl0IHRhYmxlR2V0IG5hbWVcbiAgICAgICAgcmV0dXJuIHRydWUgaWYgIWluZGV4ZXNcbiAgICAgICAgc3RhdHVzZXMgPSBjb2xsZWN0IHByb2plY3QgXCJJbmRleFN0YXR1c1wiLCBpbmRleGVzXG4gICAgICAgIGlmIGVtcHR5IGRpZmZlcmVuY2Ugc3RhdHVzZXMsIFtcIkFDVElWRVwiXVxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBhd2FpdCBzbGVlcCA1MDAwXG5cbiAgICAjIFRoZSBvcHRpb25hbCBzZWNvbmQgcGFyYW1ldGVyIGFsbG93cyB0aGUgZGV2ZWxvcGVyIHRvIGFsc28gd2FpdCBvbiBhbGwgZ2xvYmFsIHNlY29uZGFyeSBpbmRleGVzIHRvIGFsc28gYmUgcmVhZHkuXG4gICAgdGFibGVXYWl0Rm9yUmVhZHkgPSAobmFtZSwgaW5kZXhXYWl0KSAtPlxuICAgICAgY2hlY2tzID0gW19pc1RhYmxlUmVhZHkgbmFtZV1cbiAgICAgIGNoZWNrcy5wdXNoIF9hcmVJbmRleGVzUmVhZHkgbmFtZSBpZiBpbmRleFdhaXRcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsIGNoZWNrc1xuXG4gICAgdGFibGVXYWl0Rm9yRGVsZXRlZCA9IChuYW1lKSAtPlxuICAgICAgd2hpbGUgdHJ1ZVxuICAgICAgICB7VGFibGVTdGF0dXN9ID0gYXdhaXQgdGFibGVHZXQgbmFtZVxuICAgICAgICBpZiAhVGFibGVTdGF0dXNcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXdhaXQgc2xlZXAgNTAwMFxuXG4gICAgIyBUT0RPOiBtYWtlIHRoaXMgbW9yZSBlZmZpY2llbnQgYnkgdGhyb3R0bGluZyB0byBYIGNvbm5lY3Rpb25zIGF0IG9uY2UuIEFXU1xuICAgICMgb25seSBzdXBwb3J0cyBOIHJlcXVlc3RzIHBlciBzZWNvbmQgZnJvbSBhbiBhY2NvdW50LCBhbmQgSSBkb24ndCB3YW50IHRoaXNcbiAgICAjIHRvIHZpb2xhdGUgdGhhdCBsaW1pdCwgYnV0IHdlIGNhbiBkbyBiZXR0ZXIgdGhhbiBvbmUgYXQgYSB0aW1lLlxuICAgIGtleXNGaWx0ZXIgPSBjdXJyeSAoa2V5cywgaXRlbSkgLT5cbiAgICAgIGYgPSAoa2V5KSAtPiBrZXkgaW4ga2V5c1xuICAgICAgcGljayBmLCBpdGVtXG5cbiAgICB0YWJsZUVtcHR5ID0gKG5hbWUpIC0+XG4gICAgICB7S2V5U2NoZW1hfSA9IGF3YWl0IHRhYmxlR2V0IG5hbWVcbiAgICAgIGZpbHRlciA9IGtleXNGaWx0ZXIgY29sbGVjdCBwcm9qZWN0IFwiQXR0cmlidXRlTmFtZVwiLCBLZXlTY2hlbWFcblxuICAgICAge0l0ZW1zfSA9IGF3YWl0IHNjYW4gbmFtZVxuICAgICAgYXdhaXQgZGVsIG5hbWUsIGZpbHRlcihpKSBmb3IgaSBpbiBJdGVtc1xuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICMgVHlwZSBIZWxwZXJzXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICMgRHluYW1vREIgaW5jbHVkZXMgdHlwZSBpbmZvcm1hdGlvbiBtYXBwZWQgaW50byBpdHMgZGF0YSBzdHJjdHVyZXMuXG4gICAgIyBJdCBleHBlY3RzIGRhdGEgdG8gYmUgaW5wdXQgdGhhdCB3YXksIGFuZCBpbmNsdWRlcyBpdCB3aGVuIGZldGNoZWQuXG4gICAgIyBUaGVzZSBoZWxwZXJzIHdyaXRlIGFuZCBwYXJzZSB0aGF0IHR5cGUgc3lzdGVtLlxuICAgIF90cmFuc2Zvcm0gPSAoZikgLT5cbiAgICAgICh4KSAtPlxuICAgICAgICBpZiBpc09iamVjdCB4XG4gICAgICAgICAgb3V0ID0ge31cbiAgICAgICAgICBvdXRba10gPSBfbWFyayhcImFueW9ueW1vdXNEeW5hbW9kYlZhbHVlXCIsIGYgdikgZm9yIGssIHYgb2YgeFxuICAgICAgICAgIF9tYXJrIFwibmFtZWREeW5hbW9kYlZhbHVlXCIsIG91dFxuICAgICAgICBlbHNlXG4gICAgICAgICAgX21hcmsgXCJhbnlvbnltb3VzRHluYW1vZGJWYWx1ZVwiLCBmIHhcblxuICAgIF9tYXJrID0gKG5hbWUsIG9iamVjdCkgLT4gT2JqZWN0LmRlZmluZVByb3BlcnR5IG9iamVjdCwgXCJuYW1lXCIsIHZhbHVlOiBuYW1lXG5cbiAgICB0byA9XG4gICAgICBTOiBfdHJhbnNmb3JtIChzKSAtPiBTOiBzLnRvU3RyaW5nKClcbiAgICAgIE46IF90cmFuc2Zvcm0gKG4pIC0+IE46IG4udG9TdHJpbmcoKVxuICAgICAgQjogX3RyYW5zZm9ybSAoYikgLT4gQjogYi50b1N0cmluZyhcImJhc2U2NFwiKVxuICAgICAgU1M6IF90cmFuc2Zvcm0gKGEpIC0+IFNTOiAoaS50b1N0cmluZygpIGZvciBpIGluIGEpXG4gICAgICBOUzogX3RyYW5zZm9ybSAoYSkgLT4gTlM6IChpLnRvU3RyaW5nKCkgZm9yIGkgaW4gYSlcbiAgICAgIEJTOiBfdHJhbnNmb3JtIChhKSAtPiBCUzogKGkudG9TdHJpbmcoXCJiYXNlNjRcIikgZm9yIGkgaW4gYSlcbiAgICAgIE06IF90cmFuc2Zvcm0gKG0pIC0+IE06IG1cbiAgICAgIEw6IF90cmFuc2Zvcm0gKGwpIC0+IEw6IGxcbiAgICAgIE51bGw6IF90cmFuc2Zvcm0gKG4pIC0+IE5VTEw6IG5cbiAgICAgIEJvb2w6IF90cmFuc2Zvcm0gKGIpIC0+IEJPT0w6IGJcblxuICAgIHBhcnNlID0gKGF0dHJpYnV0ZXMpIC0+XG4gICAgICByZXN1bHQgPSB7fVxuICAgICAgZm9yIG5hbWUsIHR5cGVPYmogb2YgYXR0cmlidXRlc1xuICAgICAgICBkYXRhVHlwZSA9IGZpcnN0IGtleXMgdHlwZU9ialxuICAgICAgICB2ID0gZmlyc3QgdmFsdWVzIHR5cGVPYmpcbiAgICAgICAgcmVzdWx0W25hbWVdID0gc3dpdGNoIGRhdGFUeXBlXG4gICAgICAgICAgd2hlbiBcIlNcIiwgXCJTU1wiLCBcIkxcIiwgXCJCT09MXCIgdGhlbiB2XG4gICAgICAgICAgd2hlbiBcIk5cIiB0aGVuIG5ldyBOdW1iZXIgdlxuICAgICAgICAgIHdoZW4gXCJCXCIgdGhlbiBCdWZmZXIuZnJvbSB2LCBcImJhc2U2NFwiXG4gICAgICAgICAgd2hlbiBcIk5TXCIgdGhlbiAobmV3IE51bWJlciBpIGZvciBpIGluIHYpXG4gICAgICAgICAgd2hlbiBcIkJTXCIgdGhlbiAoQnVmZmVyLmZyb20gaSwgXCJiYXNlNjRcIiBmb3IgaSBpbiB2KVxuICAgICAgICAgIHdoZW4gXCJOVUxMXCJcbiAgICAgICAgICAgIGlmIHYgdGhlbiBudWxsIGVsc2UgdW5kZWZpbmVkXG4gICAgICAgICAgd2hlbiBcIk1cIiB0aGVuIHBhcnNlIHZcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJVbmFibGUgdG8gcGFyc2Ugb2JqZWN0IGZvciBEeW5hbW9EQiBhdHRyaWJ1dGUgdHlwZS4gI3tkYXRhVHlwZX1cIlxuICAgICAgcmVzdWx0XG5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAjIEl0ZW1zXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGdldCA9IChuYW1lLCBrZXksIG9wdGlvbnM9e30pIC0+XG4gICAgICB7UmV0dXJuQ29uc3VtZWRDYXBhY2l0eX0gPSBvcHRpb25zXG4gICAgICBwID0ge1RhYmxlTmFtZTogbmFtZSwgS2V5OiBrZXl9XG4gICAgICB7SXRlbSwgQ29uc3VtZWRDYXBhY2l0eX0gPSBhd2FpdCBkYi5nZXRJdGVtIG1lcmdlIHAsIG9wdGlvbnNcbiAgICAgIGlmIFJldHVybkNvbnN1bWVkQ2FwYWNpdHkgdGhlbiB7SXRlbSwgQ29uc3VtZWRDYXBhY2l0eX0gZWxzZSBJdGVtXG5cbiAgICBwdXQgPSAobmFtZSwgaXRlbSwgb3B0aW9ucz17fSkgLT5cbiAgICAgIHAgPSB7VGFibGVOYW1lOiBuYW1lLCBJdGVtOiBpdGVtfVxuICAgICAgYXdhaXQgZGIucHV0SXRlbSBtZXJnZSBwLCBvcHRpb25zXG5cbiAgICBkZWwgPSAobmFtZSwga2V5LCBvcHRpb25zPXt9KSAtPlxuICAgICAgcCA9IHtUYWJsZU5hbWU6IG5hbWUsIEtleToga2V5fVxuICAgICAgYXdhaXQgZGIuZGVsZXRlSXRlbSBtZXJnZSBwLCBvcHRpb25zXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgIyBRdWVyaWVzIGFuZCBTY2FucyBhZ2FpbnN0IFRhYmxlcyBhbmQgSW5kZXhlc1xuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBfZGVsaW1pdGVyID0gXCI8IyMjU1VORE9HRFlOQU1PREIjIyM+XCJcbiAgICBfc2V0dXBDdXJyZW50ID0gLT5cbiAgICAgIEl0ZW1zOiBbXVxuICAgICAgQ291bnQ6IDBcbiAgICAgIFNjYW5uZWRDb3VudDogMFxuICAgICAgTGFzdEV2YWx1YXRlZEtleTogZmFsc2VcbiAgICAgIENvbnN1bWVkQ2FwYWNpdHk6IFtdXG5cbiAgICBfY2F0Q3VycmVudCA9IChjdXJyZW50LCByZXN1bHRzKSAtPlxuICAgICAge0l0ZW1zLCBDb3VudCwgU2Nhbm5lZENvdW50LCBMYXN0RXZhbHVhdGVkS2V5LCBDb25zdW1lZENhcGFjaXR5fSA9IHJlc3VsdHNcbiAgICAgIGN1cnJlbnQuSXRlbXMgPSBjYXQgY3VycmVudC5JdGVtcywgSXRlbXNcbiAgICAgIGN1cnJlbnQuQ291bnQgKz0gQ291bnRcbiAgICAgIGN1cnJlbnQuU2Nhbm5lZENvdW50ICs9IFNjYW5uZWRDb3VudFxuICAgICAgY3VycmVudC5MYXN0RXZhbHVhdGVkS2V5ID0gTGFzdEV2YWx1YXRlZEtleSBpZiBMYXN0RXZhbHVhdGVkS2V5XG4gICAgICBjdXJyZW50LkNvbnN1bWVkQ2FwYWNpdHkgPSBjdXJyZW50LkNvbnN1bWVkQ2FwYWNpdHkucHVzaCBDb25zdW1lZENhcGFjaXR5XG4gICAgICBjdXJyZW50XG5cbiAgICBfcGFyc2VOYW1lID0gKG5hbWUpIC0+XG4gICAgICB0aHJvdyBuZXcgRXJyb3IgXCJNdXN0IHByb3ZpZGUgdGFibGUgbmFtZS5cIiBpZiAhbmFtZVxuICAgICAgcGFydHMgPSBuYW1lLnNwbGl0IFwiOlwiXG4gICAgICBpZiBwYXJ0cy5sZW5ndGggPiAxXG4gICAgICAgIHt0YWJsZU5hbWU6IHBhcnRzWzBdLCBpbmRleE5hbWU6IHBhcnRzWzFdfVxuICAgICAgZWxzZVxuICAgICAgICB7dGFibGVOYW1lOiBuYW1lLCBpbmRleE5hbWU6IGZhbHNlfVxuXG4gICAgX3BhcnNlQ29uZGl0aW9uYWwgPSAoZXgsIGNvdW50PTApIC0+XG4gICAgICByZXR1cm4ge3Jlc3VsdDpmYWxzZSwgdmFsdWVzOmZhbHNlLCBjb3VudH0gaWYgIWV4XG4gICAgICBWYWx1ZXMgPSB7fVxuICAgICAgcmUgPSBuZXcgUmVnRXhwIFwiI3tfZGVsaW1pdGVyfS4rPyN7X2RlbGltaXRlcn1cIiwgXCJnXCJcblxuICAgICAgcmVzdWx0ID0gZXgucmVwbGFjZSByZSwgKG1hdGNoKSAtPlxuICAgICAgICBbLCBvYmpdID0gbWF0Y2guc3BsaXQgX2RlbGltaXRlclxuICAgICAgICBwbGFjZWhvbGRlciA9IFwiOnBhcmFtI3tjb3VudH1cIlxuICAgICAgICBjb3VudCsrXG4gICAgICAgIFZhbHVlc1twbGFjZWhvbGRlcl0gPSBKU09OLnBhcnNlIG9ialxuICAgICAgICBwbGFjZWhvbGRlciAjIFJldHVybiBwbGFjZWhvbGRlciB0byB0aGUgZXhwcmVzc2lvbiB3ZSBhcmUgcHJvY2Vzc2luZy5cblxuICAgICAge3Jlc3VsdCwgdmFsdWVzOlZhbHVlcywgY291bnR9XG5cbiAgICBfcGFyc2VRdWVyeSA9IChvcHRpb25zLCBuYW1lLCBrZXlFeCwgZmlsdGVyRXgpIC0+XG4gICAgICB7dGFibGVOYW1lLCBpbmRleE5hbWV9ID0gX3BhcnNlTmFtZSBuYW1lXG4gICAgICB7cmVzdWx0OmtleSwgdmFsdWVzOmtleVZhbHVlcywgY291bnR9ID0gX3BhcnNlQ29uZGl0aW9uYWwga2V5RXhcbiAgICAgIHtyZXN1bHQ6ZmlsdGVyLCB2YWx1ZXM6ZmlsdGVyVmFsdWVzfSA9IF9wYXJzZUNvbmRpdGlvbmFsIGZpbHRlckV4LCBjb3VudFxuXG4gICAgICBvdXQgPSBvcHRpb25zXG4gICAgICBvdXQuVGFibGVOYW1lID0gdGFibGVOYW1lXG4gICAgICBvdXQuSW5kZXhOYW1lID0gaW5kZXhOYW1lIGlmIGluZGV4TmFtZVxuICAgICAgb3V0LktleUNvbmRpdGlvbkV4cHJlc3Npb24gPSBrZXkgaWYga2V5XG4gICAgICBvdXQuRmlsdGVyRXhwcmVzc2lvbiA9IGZpbHRlciBpZiBmaWx0ZXJcbiAgICAgIGlmIGtleVZhbHVlcyB8fCBmaWx0ZXJWYWx1ZXNcbiAgICAgICAgb3V0LkV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXMgPVxuICAgICAgICAgIG1lcmdlIChrZXlWYWx1ZXMgfHwge30pLCAoZmlsdGVyVmFsdWVzIHx8IHt9KVxuICAgICAgb3V0XG5cbiAgICAjIHF2IHByb2R1Y2VzIHF1ZXJ5IHN0cmluZ3Mgd2l0aCBkZWxpbWl0ZWQgdmFsdWVzIFN1bkRvZyBjYW4gcGFyc2UuXG4gICAgX3F2ID0gKG8pIC0+XG4gICAgICBkZWxpbWl0ID0gKHMpIC0+IFwiI3tfZGVsaW1pdGVyfSN7c30je19kZWxpbWl0ZXJ9XCJcbiAgICAgICMgRGV0ZXJtaW5lIGlmIHRoaXMgaXMgYSBEeW5hbW9EQiB2YWx1ZSwgYW5kIHdoZXRoZXIgaXMgYW55b255bW91cyBvciBuYW1lZC5cbiAgICAgIGlmIG8ubmFtZSA9PSBcImFueW9ueW1vdXNEeW5hbW9kYlZhbHVlXCJcbiAgICAgICAgZGVsaW1pdCBKU09OLnN0cmluZ2lmeSBvXG4gICAgICBlbHNlIGlmIG8ubmFtZSA9PSBcIm5hbWVkRHluYW1vZGJWYWx1ZVwiXG4gICAgICAgIGRlbGltaXQgSlNPTi5zdHJpbmdpZnkgZmlyc3QgdmFsdWVzIG9cbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiVW5hYmxlIHRvIGNyZWF0ZSBzdHJpbmdpZmllZCBxdWVyeSB2YWx1ZSBmb3IgdW5yZWNvbmdpZWQgb2JqZWN0ICN7SlNPTi5zdHJpbmdpZnkgb31cIlxuXG4gICAgcXYgPSBNZXRob2QuY3JlYXRlKClcbiAgICBNZXRob2QuZGVmaW5lIHF2LCBpc0Z1bmN0aW9uLCAoZikgLT4gKHgpIC0+IF9xdiBmIHhcbiAgICBNZXRob2QuZGVmaW5lIHF2LCBpc09iamVjdCwgKG8pIC0+IF9xdiBvXG5cbiAgICB1cGRhdGUgPSAobmFtZSwga2V5LCB1cGRhdGVFeCwgb3B0aW9ucz17fSkgLT5cbiAgICAgIHAgPSB7VGFibGVOYW1lOiBuYW1lLCBLZXk6IGtleX1cbiAgICAgIHtyZXN1bHQsIHZhbHVlc30gPSBfcGFyc2VDb25kaXRpb25hbCB1cGRhdGVFeFxuICAgICAgb3B0aW9ucy5VcGRhdGVFeHByZXNzaW9uID0gcmVzdWx0IGlmIHJlc3VsdFxuICAgICAgb3B0aW9ucy5FeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzID0gdmFsdWVzIGlmIHZhbHVlc1xuICAgICAgYXdhaXQgZGIudXBkYXRlSXRlbSBtZXJnZSBwLCBvcHRpb25zXG5cbiAgICBxdWVyeSA9IChuYW1lLCBrZXlFeCwgZmlsdGVyRXgsIG9wdGlvbnM9e30sIGN1cnJlbnQpIC0+XG4gICAgICBjdXJyZW50ID0gX3NldHVwQ3VycmVudCgpIGlmICFjdXJyZW50XG4gICAgICBpZiAhY3VycmVudC5vcHRpb25zXG4gICAgICAgIGN1cnJlbnQub3B0aW9ucyA9IG9wdGlvbnMgPSBfcGFyc2VRdWVyeSBvcHRpb25zLCBuYW1lLCBrZXlFeCwgZmlsdGVyRXhcbiAgICAgIGVsc2VcbiAgICAgICAge29wdGlvbnN9ID0gY3VycmVudFxuXG4gICAgICBwID0ge31cbiAgICAgIHAuRXhjbHVzaXZlU3RhcnRLZXkgPSBjdXJyZW50Lkxhc3RFdmFsdWF0ZWRLZXkgaWYgY3VycmVudC5MYXN0RXZhbHVhdGVkS2V5XG4gICAgICByZXN1bHRzID0gYXdhaXQgZGIucXVlcnkgbWVyZ2UgcCwgb3B0aW9uc1xuXG4gICAgICBjdXJyZW50ID0gX2NhdEN1cnJlbnQgY3VycmVudCwgcmVzdWx0c1xuICAgICAgaWYgIXJlc3VsdHMuTGFzdEV2YWx1YXRlZEtleSB8fCBvcHRpb25zLkxpbWl0XG4gICAgICAgIGN1cnJlbnRcbiAgICAgIGVsc2VcbiAgICAgICAgYXdhaXQgcXVlcnkgbmFtZSwga2V5RXgsIGZpbHRlckV4LCBvcHRpb25zLCBjdXJyZW50XG5cbiAgICBzY2FuID0gKG5hbWUsIGZpbHRlckV4LCBvcHRpb25zPXt9LCBjdXJyZW50KSAtPlxuICAgICAgY3VycmVudCA9IF9zZXR1cEN1cnJlbnQoKSBpZiAhY3VycmVudFxuICAgICAgaWYgIWN1cnJlbnQub3B0aW9uc1xuICAgICAgICBjdXJyZW50Lm9wdGlvbnMgPSBvcHRpb25zID0gX3BhcnNlUXVlcnkgb3B0aW9ucywgbmFtZSwgZmFsc2UsIGZpbHRlckV4XG4gICAgICBlbHNlXG4gICAgICAgIHtvcHRpb25zfSA9IGN1cnJlbnRcblxuICAgICAgcCA9IHt9XG4gICAgICBwLkV4Y2x1c2l2ZVN0YXJ0S2V5ID0gY3VycmVudC5MYXN0RXZhbHVhdGVkS2V5IGlmIGN1cnJlbnQuTGFzdEV2YWx1YXRlZEtleVxuICAgICAgcmVzdWx0cyA9IGF3YWl0IGRiLnNjYW4gbWVyZ2UgcCwgb3B0aW9uc1xuXG4gICAgICBjdXJyZW50ID0gX2NhdEN1cnJlbnQgY3VycmVudCwgcmVzdWx0c1xuICAgICAgaWYgIXJlc3VsdHMuTGFzdEV2YWx1YXRlZEtleSB8fCBvcHRpb25zLkxpbWl0XG4gICAgICAgIGN1cnJlbnRcbiAgICAgIGVsc2VcbiAgICAgICAgYXdhaXQgc2NhbiBuYW1lLCBmaWx0ZXJFeCwgb3B0aW9ucywgY3VycmVudFxuXG5cblxuICAgIHt0YWJsZUdldCwgdGFibGVDcmVhdGUsIHRhYmxlVXBkYXRlLCB0YWJsZURlbCwgdGFibGVXYWl0Rm9yUmVhZHksIHRhYmxlV2FpdEZvckRlbGV0ZWQsIHRhYmxlRW1wdHksIGtleXNGaWx0ZXIsIHRvLCBwYXJzZSwgbWVyZ2UsIGdldCwgcHV0LCBkZWwsIHF2LCB1cGRhdGUsIHF1ZXJ5LCBzY2FufVxuXG5leHBvcnQgZGVmYXVsdCBkeW5hbW9kYlByaW1pdGl2ZVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=primitives/dynamodb.coffee