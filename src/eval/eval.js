'use strict';

var env = require('./env');

var evalStatements = function (statements, scope) {
  return statements.reduce(function (acc, statement) {
    return evaluate(statement, scope);
  }, null);
};

var evaluate = function (expr, scope) {
  scope = scope || env.root();

  if (Array.isArray(expr)) {
    return evalStatements(expr, scope);
  }

  if (typeof expr === 'number') {
    return expr;
  }

  if (expr.tag === 'ident') {
    return env.lookup(scope, expr.name);
  }

  if (expr.tag === '<=') {
    return evaluate(expr.left, scope) <= evaluate(expr.right, scope);
  }

  if (expr.tag === '>=') {
    return evaluate(expr.left, scope) >= evaluate(expr.right, scope);
  }

  if (expr.tag === '!=') {
    return evaluate(expr.left, scope) !== evaluate(expr.right, scope);
  }

  if (expr.tag === '==') {
    return evaluate(expr.left, scope) === evaluate(expr.right, scope);
  }

  if (expr.tag === '<') {
    return evaluate(expr.left, scope) < evaluate(expr.right, scope);
  }

  if (expr.tag === '>') {
    return evaluate(expr.left, scope) > evaluate(expr.right, scope);
  }

  if (expr.tag === '+') {
    return evaluate(expr.left, scope) + evaluate(expr.right, scope);
  }

  if (expr.tag === '-') {
    return evaluate(expr.left, scope) - evaluate(expr.right, scope);
  }

  if (expr.tag === '*') {
    return evaluate(expr.left, scope) * evaluate(expr.right, scope);
  }

  if (expr.tag === '/') {
    return evaluate(expr.left, scope) / evaluate(expr.right, scope);
  }

  if (expr.tag === 'call') {
    var fn = env.lookup(scope, expr.name);

    var args = expr.args.map(function (arg) {
      return evaluate(arg, scope);
    });

    return fn.apply(null, args);
  }

  if (expr.tag === 'ignore') {
    return evaluate(expr.body, scope);
  }

  if (expr.tag === 'var') {
    return env.create(scope, expr.name, 0);
  }

  if (expr.tag === ':=') {
    return env.update(scope, expr.left, evaluate(expr.right, scope));
  }

  if (expr.tag === 'if') {
    if (!evaluate(expr.expr, scope)) { return; }
    return evalStatements(expr.body, scope);
  }

  if (expr.tag === 'repeat') {
    var times = evaluate(expr.expr, scope);
    var val;

    for (var i = 0; i < times; i++) {
        val = evalStatements(expr.body, scope);
    }

    return val;
  }

  if (expr.tag === 'define') {
    var inner = env.inner(scope);

    return env.create(scope, expr.name, function () {
      var args = [].slice.call(arguments);

      inner.bindings = args.reduce(function (acc, arg, index) {
        acc[expr.args[index]] = arg;
        return acc;
      }, {});

      return evalStatements(expr.body, inner);
    });
  }
};

module.exports = {
  eval: evaluate
};
