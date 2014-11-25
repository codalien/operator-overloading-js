'use strict';

var esprima = require('esprima');
var escodegen = require('escodegen');

var funcNames = {
    '+': '__plus',
    '==': '__doubleEqual',
    '===': '__tripleEqual',
    '||': '__logicalOR',
    '&&': '__logicalAND',
    '|': '__bitwiseOR',
    '^': '__bitwiseXOR',
    '&': '__bitwiseAND',
    '!=': '__notEqual',
    '!==': '__notDoubleEqual',
    '<': '__lessThan',
    '>': '__greaterThan',
    '<=': '__lessThanEqual',
    '>=': '__greaterThanEqual',
    'in': '__in',
    'instanceof': '__instanceOf',
    '<<': '__bitwiseLSHIFT',
    '>>': '__bitwiseRSHIFT',
    '>>>': '__zeroFillRSHIFT',
    '-': '__minus',
    '*': '__multiply',
    '%': '__modulus',
    '/': '__divide',
    'u-': '__unaryNegation',
    'u+': '__unaryAddition',
    '~': '__bitwiseNOT',
    '++': '__increment',
    '--': '__decrement',
    '!': '__unaryNOT',
    '+=': '__addAssign',
    '-=': '__minusAssign',
    '*=': '__multiplyAssign',
    '/=': '__divideAssign',
    '%=': '__modulusAssign',
    '<<=': '__leftShiftAssign',
    '>>=': '__rightShiftAssign',
    '>>>=': '__zeroFillRightShiftAssign',
    '&=': '__andAssign',
    '|=': '__orAssign',
    '^=': '__xorAssign'
};

//The AST Walker And Transformer
function visit(statement, index, program) {
    switch (statement.type) {
        case 'VariableDeclaration':
            statement.declarations.forEach(function (declaration, idx) {
                visit(declaration.init, idx, program);
            });
            break;
        case 'BinaryExpression':
        case 'LogicalExpression':
            if (statement.operator && funcNames[statement.operator]) {
                statement.type = 'CallExpression';
                statement.callee = {
                    'type': 'MemberExpression',
                    'computed': false,
                    'object': statement.right,
                    'property': {
                        'type': 'Identifier',
                        'name': funcNames[statement.operator]
                    }
                };
                visit(statement.left, index, program);
                visit(statement.right, index, program);
                statement['arguments'] = [statement.left];
            } else {
                visit(statement.left, index, program);
                visit(statement.right, index, program);
            }
            break;
        case 'ExpressionStatement':
            visit(statement.expression, index, program);
            break;
        case 'CallExpression':
            statement['arguments'].forEach(function (argument, idx) {
                visit(argument, idx, program);
            });
            break;
        case 'AssignmentExpression':
            if (statement.operator && funcNames[statement.operator]) {
                var rightOld = statement.right;
                statement.right = {
                    'type': 'BinaryExpression',
                    'operator': statement.operator.replace(/=/, '').trim(),
                    'left': statement.left,
                    'right': rightOld
                };
                statement.operator = '=';
                visit(statement.left, index, program);
                visit(statement.right, index, program);
            } else {
                visit(statement.right, index, program);
            }
            break;
        case 'UnaryExpression':
            if (statement.operator && funcNames[statement.operator]) {
                statement.type = 'CallExpression';
                statement.callee = {
                    'type': 'MemberExpression',
                    'computed': false,
                    'object': statement.argument,
                    'property': {
                        'type': 'Identifier',
                        'name': (statement.operator === '+' || statement.operator === '-') ? funcNames['u' + statement.operator] : funcNames[statement.operator]
                    }
                };
                visit(statement.argument, index, program);
                statement['arguments'] = [];
            } else {
                visit(statement.argument, index, program);
            }
            break;
        case 'UpdateExpression':
            if (statement.operator && funcNames[statement.operator]) {
                statement.type = 'CallExpression';
                statement.callee = {
                    'type': 'MemberExpression',
                    'computed': false,
                    'object': statement.argument,
                    'property': {
                        'type': 'Identifier',
                        'name': funcNames[statement.operator]
                    }
                };
                visit(statement.argument, index, program);
                statement['arguments'] = [];
            }
            break;
        case 'FunctionDeclaration':
        case 'FunctionExpression':
            visit(statement.body, index, program);
            break;
        case 'BlockStatement':
            statement.body.forEach(function (statement) {
                visit(statement, index, program);
            });
            break;
        case 'ReturnStatement':
            visit(statement.argument, index, program);
            break;
        //We don't ned to transform following nodes! Phew!
        case 'Literal':
        case 'Identifier':
            break;
    }
}

//Do the magic
Function.prototype.enableOverloading = function () {
    //Generate AST
    var ast = esprima.parse('var fn = ' + this);

    //Check for AST
    if (!ast) throw new Error('Invalid code block! Cannot overload. AST Generation Error.');

    //Fetch arguments
    var args = ast.body[0].declarations[0].init.params.reduce(function (init, val) {
        init.push(val.name);
        return init;
    }, []);

    //Fetch function body
    var body = ast.body[0].declarations[0].init.body;

    //Build the desired program
    var program = {
        'type': 'Program',
        'body': body.body
    };

    //Transform
    program.body.forEach(function (statement, index) {
        visit(statement, index, program);
    });

    //Build new function args
    args.push(escodegen.generate(program, {
        comment: true,
        format: {
            indent: {
                style: '  '
            }
        }
    }));
    var retFn = Function.apply(this, args);
    if (process.env.OVERLOAD_DEBUG) console.log(JSON.stringify(program, null, 4));
    if (process.env.OVERLOAD_DEBUG) console.log(retFn.toString());
    return retFn;
};

/* jshint ignore:start */
function defineDefaultProp(constructor, name, val) {
    Object.defineProperty(constructor.prototype, name, {
        enumerable: false,
        writable: true,
        configurable: false,
        value: val
    });
}

//Load defaults
var cons = [Object, Number, String, Function, RegExp];
cons.forEach(function (constructor) {
    defineDefaultProp(constructor, funcNames['+'], function (o) {
        return o + this;
    });
    defineDefaultProp(constructor, funcNames['=='], function (o) {
        return o == this;
    });
    defineDefaultProp(constructor, funcNames['==='], function (o) {
        return o === this;
    });
    defineDefaultProp(constructor, funcNames['||'], function (o) {
        return o || this;
    });
    defineDefaultProp(constructor, funcNames['&&'], function (o) {
        return o && this;
    });
    defineDefaultProp(constructor, funcNames['&'], function (o) {
        return o & this;
    });
    defineDefaultProp(constructor, funcNames['|'], function (o) {
        return o | this;
    });
    defineDefaultProp(constructor, funcNames['^'], function (o) {
        return o ^ this;
    });
    defineDefaultProp(constructor, funcNames['!='], function (o) {
        return o != this;
    });
    defineDefaultProp(constructor, funcNames['!=='], function (o) {
        return o !== this;
    });
    defineDefaultProp(constructor, funcNames['<'], function (o) {
        return o < this;
    });
    defineDefaultProp(constructor, funcNames['>'], function (o) {
        return o > this;
    });
    defineDefaultProp(constructor, funcNames['>>'], function (o) {
        return o >> this;
    });
    defineDefaultProp(constructor, funcNames['<<'], function (o) {
        return o << this;
    });
    defineDefaultProp(constructor, funcNames['>>>'], function (o) {
        return o >>> this;
    });
    defineDefaultProp(constructor, funcNames['<='], function (o) {
        return o <= this;
    });
    defineDefaultProp(constructor, funcNames['>='], function (o) {
        return o >= this;
    });
    defineDefaultProp(constructor, funcNames['in'], function (o) {
        return o in this;
    });
    defineDefaultProp(constructor, funcNames['instanceof'], function (o) {
        return o instanceof this;
    });
    defineDefaultProp(constructor, funcNames['-'], function (o) {
        return o - this;
    });
    defineDefaultProp(constructor, funcNames['*'], function (o) {
        return o * this;
    });
    defineDefaultProp(constructor, funcNames['%'], function (o) {
        return o % this;
    });
    defineDefaultProp(constructor, funcNames['/'], function (o) {
        return o / this;
    });
    defineDefaultProp(constructor, funcNames['u-'], function () {
        return -this;
    });
    defineDefaultProp(constructor, funcNames['u+'], function () {
        return +this;
    });
    defineDefaultProp(constructor, funcNames['~'], function () {
        return ~this;
    });
    defineDefaultProp(constructor, funcNames['++'], function () {
        var val = this;
        ++val;
        return val;
    });
    defineDefaultProp(constructor, funcNames['--'], function () {
        var val = this;
        --val;
        return val;
    });
    defineDefaultProp(constructor, funcNames['!'], function () {
        return !this;
    });
    defineDefaultProp(constructor, funcNames['+='], function (o) {
        return o += this;
    });
    defineDefaultProp(constructor, funcNames['-='], function (o) {
        return o -= this;
    });
    defineDefaultProp(constructor, funcNames['*='], function (o) {
        return o *= this;
    });
    defineDefaultProp(constructor, funcNames['/='], function (o) {
        return o /= this;
    });
    defineDefaultProp(constructor, funcNames['%='], function (o) {
        return o %= this;
    });
    defineDefaultProp(constructor, funcNames['<<='], function (o) {
        return o <<= this;
    });
    defineDefaultProp(constructor, funcNames['>>='], function (o) {
        return o >>= this;
    });
    defineDefaultProp(constructor, funcNames['>>>='], function (o) {
        return o >>>= this;
    });
    defineDefaultProp(constructor, funcNames['&='], function (o) {
        return o &= this;
    });
    defineDefaultProp(constructor, funcNames['|='], function (o) {
        return o |= this;
    });
    defineDefaultProp(constructor, funcNames['^='], function (o) {
        return o ^= this;
    });
});
/* jshint ignore:end */

exports.functionNames = funcNames;
