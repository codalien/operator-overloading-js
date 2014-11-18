var esprima = require('esprima');
var escodegen = require('escodegen');

var funcNames = {
    '+': '__plus',
    '==': '__doubleEqual',
    '===': '__tripleEqual'
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
            if (statement.operator) {
                statement.type = 'CallExpression';
                statement.callee = {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": statement.right,
                    "property": {
                        "type": "Identifier",
                        "name": funcNames[statement.operator]
                    }
                };
                visit(statement.left);
                statement.arguments = [statement.left];
            }
            break;
        case 'ExpressionStatement':
            visit(statement.expression, index, program);
            break;
        case 'CallExpression':
            statement.arguments.forEach(function (argument, idx) {
                visit(argument, idx, program);
            });
            break;
        case 'AssignmentExpression':
            visit(statement.right, index, program);
            break;
        case 'Literal':
        case 'Identifier':
        case 'BlockStatement':
        case 'FunctionExpression':
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
    var arguments = ast.body[0].declarations[0].init.params.reduce(function (init, val) {
        init.push(val.name);
        return init;
    }, []);

    //Fetch function body
    var body = ast.body[0].declarations[0].init.body;

    //Build the desired program
    var program = {
        "type": "Program",
        "body": body.body
    };

    //Transform
    program.body.forEach(function (statement, index) {
        visit(statement, index, program);
    });

    //Build new function args
    arguments.push(escodegen.generate(program, {
        comment: true,
        format: {
            indent: {
                style: '  '
            }
        }
    }));
    var retFn = Function.apply(this, arguments);

    //console.log(retFn.toString());
    return retFn;
};

//Load defaults
var cons = [Object, Number, String, Function, RegExp];
cons.forEach(function (constructor) {
    Object.defineProperty(constructor.prototype, '__plus', {
        enumerable: false,
        writable: true,
        configurable: false,
        value: function (o) {
            return o + this;
        }
    });
    Object.defineProperty(constructor.prototype, '__doubleEqual', {
        enumerable: false,
        writable: true,
        configurable: false,
        value: function (o) {
            return this == o;
        }
    });
    Object.defineProperty(constructor.prototype, '__tripleEqual', {
        enumerable: false,
        writable: true,
        configurable: false,
        value: function (o) {
            return this === o;
        }
    });
});