'use strict';

var esprima = require('esprima');
var escodegen = require('escodegen');
var estraverse = require('estraverse');

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
var visitor = {
    enter: function(node, parent) {
        switch(node.type) {
            case 'BinaryExpression':
            case 'LogicalExpression':
                if (node.operator && funcNames[node.operator]) {
                    return {
                        type: 'CallExpression',
                        callee: {
                            'type': 'MemberExpression',
                            'computed': false,
                            'object': node.right,
                            'property': {
                                'type': 'Identifier',
                                'name': funcNames[node.operator]
                            }
                        },
                        arguments: [node.left]
                    };
                }
                break;
            case 'AssignmentExpression':
                if (node.operator && funcNames[node.operator]) {
                    return {
                        type: 'AssignmentExpression',
                        left: node.left,
                        right: {
                            type: 'CallExpression',
                            callee: {
                                'type': 'MemberExpression',
                                'computed': false,
                                'object': node.left,
                                'property': {
                                    'type': 'Identifier',
                                    'name': funcNames[node.operator]
                                }
                            },
                            arguments: [node.right]
                        },
                        operator: '='
                    }
                }
                break;
            case 'UnaryExpression':
            case 'UpdateExpression':
                if (node.operator && funcNames[node.operator]) {
                    return {
                        type: 'CallExpression',
                        callee: {
                            'type': 'MemberExpression',
                            'computed': false,
                            'object': node.argument,
                            'property': {
                                'type': 'Identifier',
                                'name': (node.operator === '+' || node.operator === '-') ? funcNames['u' + node.operator] : funcNames[node.operator]
                            }
                        },
                        arguments: []
                    };
                }
                break;
        }
    }
}

//Do the magic
module.exports = exports = function (func) {
    //Generate AST
    var ast = esprima.parse('var fn = ' + func);

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
    estraverse.replace(program, visitor)

    //Build new function args
    args.push(escodegen.generate(program, {
        comment: true,
        format: {
            indent: {
                style: '  '
            }
        }
    }));
    var retFn = Function.apply(func, args);
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
