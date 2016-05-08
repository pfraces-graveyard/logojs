start = statements

ws = [ \t\n]*

float = "." float:[0-9]+ { return '.' + float.join(''); }
number = sign:[-+]? int:[0-9]+ float:float? { return Number((sign || '') + int.join('') + (float || '')); }
identifier = first:[a-zA-Z_] rest:[0-9a-zA-Z_]* { return first + rest.join(''); }

comma_expression = "," ws expr:expression { return expr; }
arglist = first:expression rest:comma_expression* { return [first].concat(rest); }

fn_call
  = v:identifier "(" ws ")" { return { tag: 'call', name: v, args: [] }; }
  / v:identifier "(" ws args:arglist ws ")" { return { tag: 'call', name: v, args: args }; }

comma_identifier = "," ws v:identifier { return v; }
ident_list = first:identifier rest:comma_identifier* { return [first].concat(rest); }

fn_def
  = "define " ws v:identifier ws "(" ws ")" ws "{" ws body:statements ws "}" ws { return { tag:"define", name:v, args:[], body:body }; }
  / "define " ws v:identifier ws "(" ws args:ident_list ws ")" ws "{" ws body:statements ws "}" ws { return { tag:"define", name:v, args:args, body:body }; }

comp_op = "<=" / ">=" / "!=" / "==" / "<" / ">"
additive_op = "+" / "-"
mult_op = "*" / "/"

expression = comparative

comparative
  = left:additive ws op:comp_op ws right:comparative { return { tag: op, left: left, right: right }; }
  / additive

additive
  = left:multiplicative ws op:additive_op ws right:additive { return { tag: op, left: left, right: right }; }
  / multiplicative

multiplicative
  = left:primary ws op:mult_op ws right:multiplicative { return { tag: op, left: left, right: right }; }
  / primary

primary
  = number
  / fn_call
  / ident:identifier { return { tag: 'ident', name: ident }; }
  / "(" ws expr:expression ws ")" { return expr; }

statement
  = expr:expression ws ";" ws { return { tag:"ignore", body:expr }; }
  / v:identifier ws ":=" ws expr:expression ws ";" { return { tag:":=", left:v, right:expr }; }
  / "var" ws v:identifier ws ";" { return { tag: "var", name: v }; }
  / "if" ws "(" ws expr:expression ws ")" ws "{" ws body:statements ws "}" ws { return { tag:"if", expr:expr, body:body }; }
  / "repeat" ws "(" ws expr:expression ws ")" ws "{" ws body:statements ws "}" ws { return { tag:"repeat", expr:expr, body:body }; }
  / fn_def

stmt = ws stmt:statement { return stmt; }
statements = stmt*
