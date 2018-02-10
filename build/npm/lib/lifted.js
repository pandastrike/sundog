"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fairmont = require("fairmont");

var _AWS,
    avoidedServices,
    liftAll,
    liftService,
    indexOf = [].indexOf;

avoidedServices = ["CloudSearchDomain", "IotData"];

liftService = function (s) {
  var k, service, v;
  service = {};
  for (k in s) {
    v = s[k];
    service[k] = (0, _fairmont.isFunction)(v) ? (0, _fairmont.lift)((0, _fairmont.bind)(v, s)) : v;
  }
  return service;
};

liftAll = function (AWS) {
  var k, ref, services, v;
  services = {};
  for (k in AWS) {
    v = AWS[k];
    if ((0, _fairmont.isFunction)(v) && ((ref = v.__super__) != null ? ref.name : void 0) === "Service" && indexOf.call(avoidedServices, k) < 0) {
      services[k] = liftService(new v());
    }
  }
  return services;
};

_AWS = function (AWS) {
  return liftAll(AWS);
};

exports.default = _AWS;