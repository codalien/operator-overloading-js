*Oveload-JS*

This library enables simple operator overloading in Javascript code. This library has minimal runtime overheads, all overheads are done on loading time which is fair as that is done only when the system loads. Runtime performance is what is aimed for.

##Overloadable Operators##
Following are the operators which can be overloaded with the desired overload function name:
```javascript
{
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
}
```

**Example**
```javascript

require('../../overload-js');


//An example Constructor Class
function Count(val) {
    var _this = this;
    this.val = val;
    this.__plus = function (operand) {
        console.log("adding Count");
        _this.val += operand.val;
    };

    this.__doubleEqual = function (operand) {
        console.log('double Equal Check')
        return _this.val == operand.val;
    };

    this.__tripleEqual = function(operand) {
        console.log('triple Equal Check');
        return _this.val === operand.val;
    };
}

//We can put in Native types too
String.prototype.__plus = function (o) {
    return (this + " <added> " + o);
};

//Number example
Number.prototype.__plus = function (operand) {
    console.log('Adding:', this, '+', operand);
    return this + operand;
};


//That's how you do it
var run = function () {
        var res = v1 + v2 + v3;

        console.log(3 + 44 + 100);

        console.log('v1', v1);
        console.log('v2', v2);
        console.log('v3', v3);
        console.log('res', res);

        console.log(v1 == v2);
        console.log(v1 === v2);

        console.log('hello' + 'yello' + 'fellow' + 'yo!');

        console.log(33 + (3 + 3) + 55);

}.enableOverloading(); //Do this to enable operator overloading in this function. We don't recommend global enablement as that would be confusing.

run();


```