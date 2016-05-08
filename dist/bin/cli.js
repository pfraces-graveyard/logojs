'use strict';

var parser = require('../parser/parser');
var interpreter = require('../eval/eval');

var stdout = function () {
  var args = [].slice.call(arguments);
  process.stdout.write(args.join(' ') + '\n');
};

var expr = process.argv.slice(2).join(' ');
stdout(interpreter.eval(parser.parse(expr)));
