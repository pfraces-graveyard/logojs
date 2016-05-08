'use strict';

var host = require('./host');

var root = function () {
  return {
    bindings: host,
    outer: {}
  };
};

var inner = function (env) {
  return {
    bindings: {},
    outer: env
  };
};

var create = function (env, v, val) {
  if (typeof env.bindings[v] !== 'undefined') {
    throw new Error('reference already defined: ' + v);
  }

  env.bindings[v] = val;
};

var lookup = function (env, v) {
  if (!env.bindings) { return; }

  if (typeof env.bindings[v] !== 'undefined') {
    return env.bindings[v];
  }

  return lookup(env.outer, v);
};

var update = function (env, v, val) {
  if (!env.bindings) {
    throw new Error('undeclared reference: ' + v);
  }

  if (typeof env.bindings[v] !== 'undefined') {
    env.bindings[v] = val;
    return val;
  }

  return update(env.outer, v, val);
};

module.exports = {
  root: root,
  inner: inner,
  create: create,
  lookup: lookup,
  update: update
};
