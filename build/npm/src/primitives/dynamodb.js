"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fairmont = require("fairmont");

var _utils = require("./utils");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Primitives for the service DynamoDB.
// The main entities are Tables and Items.
// This follows the naming convention that methods that work on Tables will be
// prefixed "table*", whereas item methods will have no prefix.
var dynamodbPrimative,
    indexOf = [].indexOf;

dynamodbPrimative = function (_AWS) {
  var _areIndexesReady, _catCurrent, _delimiter, _isTableReady, _mark, _parseConditional, _parseName, _parseQuery, _qv, _setupCurrent, _transform, db, del, get, keysFilter, parse, put, query, qv, scan, tableCreate, tableDel, tableEmpty, tableGet, tableUpdate, tableWaitForDeleted, tableWaitForReady, to, update;
  ({
    DynamoDB: db
  } = _AWS);
  //===========================================================================
  // Tables
  //===========================================================================
  tableGet = (() => {
    var _ref = _asyncToGenerator(function* (name) {
      var Table, e;
      try {
        ({ Table } = yield db.describeTable({
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
  })();
  tableCreate = (() => {
    var _ref2 = _asyncToGenerator(function* (name, keys, attributes, throughput, options = {}) {
      var TableDescription, p;
      p = {
        TableName: name,
        KeySchema: keys,
        AttributeDefinitions: attributes,
        ProvisionedThroughput: throughput
      };
      ({ TableDescription } = yield db.createTable((0, _fairmont.merge)(p, options)));
      return TableDescription;
    });

    return function tableCreate(_x2, _x3, _x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  })();
  tableUpdate = (() => {
    var _ref3 = _asyncToGenerator(function* (name, attributes, throughput, options = {}) {
      var TableDescription, p;
      p = {
        TableName: name,
        AttributeDefinitions: attributes
      };
      if (throughput) {
        p.ProvisionedThroughput = throughput;
      }
      ({ TableDescription } = yield db.updateTable((0, _fairmont.merge)(p, options)));
      return TableDescription;
    });

    return function tableUpdate(_x6, _x7, _x8) {
      return _ref3.apply(this, arguments);
    };
  })();
  tableDel = (() => {
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
  })();
  _isTableReady = (() => {
    var _ref5 = _asyncToGenerator(function* (name) {
      var TableStatus;
      while (true) {
        ({ TableStatus } = yield tableGet(name));
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
  })();
  _areIndexesReady = (() => {
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
  })();
  // The optional second parameter allows the developer to also wait on all global secondary indexes to also be ready.
  tableWaitForReady = (() => {
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
  })();
  tableWaitForDeleted = (() => {
    var _ref8 = _asyncToGenerator(function* (name) {
      var TableStatus;
      while (true) {
        ({ TableStatus } = yield tableGet(name));
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
  })();
  // TODO: make this more efficient by throttling to X connections at once. AWS
  // only supports N requests per second from an account, and I don't want this
  // to violate that limit, but we can do better than one at a time.
  keysFilter = (0, _fairmont.curry)(function (keys, item) {
    var f;
    f = function (key) {
      return indexOf.call(keys, key) >= 0;
    };
    return (0, _fairmont.pick)(f, item);
  });
  tableEmpty = (() => {
    var _ref9 = _asyncToGenerator(function* (name) {
      var Items, KeySchema, filter, i, j, len, results1;
      ({ KeySchema } = yield tableGet(name));
      filter = keysFilter((0, _fairmont.collect)((0, _fairmont.project)("AttributeName", KeySchema)));
      ({ Items } = yield scan(name));
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
  })();
  //===========================================================================
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
  };
  //===========================================================================
  // Items
  //===========================================================================
  get = (() => {
    var _ref10 = _asyncToGenerator(function* (name, key, options = {}) {
      var ConsumedCapacity, Item, ReturnConsumedCapacity, p;
      ({ ReturnConsumedCapacity } = options);
      p = {
        TableName: name,
        Key: key
      };
      ({ Item, ConsumedCapacity } = yield db.getItem((0, _fairmont.merge)(p, options)));
      if (ReturnConsumedCapacity) {
        return { Item, ConsumedCapacity };
      } else {
        return Item;
      }
    });

    return function get(_x16, _x17) {
      return _ref10.apply(this, arguments);
    };
  })();
  put = (() => {
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
  })();
  del = (() => {
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
  })();
  //===========================================================================
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
    ({ Items, Count, ScannedCount, LastEvaluatedKey, ConsumedCapacity } = results);
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
    ({ tableName, indexName } = _parseName(name));
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
  };
  // qv produces query strings with delimited values SunDog can parse.
  _qv = function (o) {
    var delimit;
    delimit = function (s) {
      return `${_delimiter}${s}${_delimiter}`;
    };
    // Determine if this is a DynamoDB value, and whether is anyonymous or named.
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
  update = (() => {
    var _ref13 = _asyncToGenerator(function* (name, key, updateEx, options = {}) {
      var p, result;
      p = {
        TableName: name,
        Key: key
      };
      ({ result, values: _fairmont.values } = _parseConditional(updateEx));
      if (result) {
        options.UpdateExpression = result;
      }
      if (_fairmont.values) {
        options.ExpressionAttributeValues = _fairmont.values;
      }
      return yield db.putItem((0, _fairmont.merge)(p, options));
    });

    return function update(_x22, _x23, _x24) {
      return _ref13.apply(this, arguments);
    };
  })();
  query = (() => {
    var _ref14 = _asyncToGenerator(function* (name, keyEx, filterEx, options = {}, current) {
      var p, results;
      if (!current) {
        current = _setupCurrent();
      }
      if (!current.options) {
        current.options = options = _parseQuery(options, name, keyEx, filterEx);
      } else {
        ({ options } = current);
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
  })();
  scan = (() => {
    var _ref15 = _asyncToGenerator(function* (name, filterEx, options = {}, current) {
      var p, results;
      if (!current) {
        current = _setupCurrent();
      }
      if (!current.options) {
        current.options = options = _parseQuery(options, name, false, filterEx);
      } else {
        ({ options } = current);
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
  })();
  return { tableGet, tableCreate, tableUpdate, tableDel, tableWaitForReady, tableWaitForDeleted, tableEmpty, keysFilter, to, parse, merge: _fairmont.merge, get, put, del, qv, update, query, scan };
};

exports.default = dynamodbPrimative;