#Operator-Overloading-JS#

This library enables simple **operator overloading** in Javascript code.
This library has minimal runtime overheads, all overheads are done on loading time which is fair as that is done only when the system loads. Runtime performance is what is aimed for.

##Installation##
This library is available for **Node** and **Browser** both. See the installation steps below:

###Node Module (NPM)##
```bash
npm install operator-overloading --save
```

###Browser (Bower)###
```bash
bower install operator-overloading --save
```

##Sneak Peak Example##
Here is a quick sneak peak of the usage:
```javascript
require('operator-overloading');
(function () {
    //A simple student constructor
    function Student(name, marks) {
        var _this = this;
        this.name = name;
        this.marks = marks;
        //THIS is WHERE we OVERLOAD '+' Operator
        this.__plus = function (leftOperand) {
            return new Student([leftOperand.name, _this.name].join('+'), leftOperand.marks + _this.marks);
        };
        this.toString = function () {
            return _this.name + ':' + _this.marks;
        };
    }

    //Define some students
    var kushal = new Student('Kushal', 66),
        kashish = new Student('Kashish', 90),
        vibhor = new Student('Vibhor', 80);

    //See the overload magic
    var group1 = kushal + kashish,
        group2 = kushal + kashish + vibhor,
        group3 = kushal + vibhor;

    //Lets print
    console.log(group1.toString()); //Output: Kushal+Kashish:156
    console.log(group2.toString()); //Output: Kushal+Kashish+Vibhor:236
    console.log(group3.toString()); //Output: Kushal+Vibhor:146

}.enableOverloading()/*Here you are enabling overloading for this function scope only*/)();

```

##Overloadable Operators##
Following are the operators which can be overloaded with the desired overload function name:


| S.No | Operator | Function Name | Operator Type |
|------|----------|---------------|---------------|
| 1 | + | __plus | Binary |
| 2 | == | __doubleEqual | Binary |
| 3 | === | __tripleEqual | Binary |
| 4 | \|\| | __logicalOR | Binary |
| 5 | && | __logicalAND | Binary |
| 6 | \| | __bitwiseOR | Binary |
| 7 | ^ | __bitwiseXOR | Binary |
| 8 | & | __bitwiseAND | Binary |
| 9 | != | __notEqual | Binary |
| 10 | !== | __notDoubleEqual | Binary |
| 11 | < | __lessThan | Binary |
| 12 | > | __greaterThan | Binary |
| 13 | <= | __lessThanEqual | Binary |
| 14 | >= | __greaterThanEqual | Binary |
| 15 | in | __in | Binary |
| 16 | instanceof | __instanceOf | Binary |
| 17 | << | __bitwiseLSHIFT | Binary |
| 18 | >> | __bitwiseRSHIFT | Binary |
| 19 | >>> | __zeroFillRSHIFT | Binary |
| 20 | - | __minus | Binary |
| 21 | * | __multiply | Binary |
| 22 | % | __modulus | Binary |
| 23 | / | __divide | Binary |
| 24 | u- | __unaryNegation | Unary |
| 25 | u+ | __unaryAddition | Unary |
| 26 | ~ | __bitwiseNOT | Unary |
| 27 | ++ | __increment | Unary |
| 28 | -- | __decrement | Unary |
| 29 | ! | __unaryNOT | Unary |
| 30 | += | __addAssign | Assignment |
| 31 | -= | __minusAssign | Assignment |
| 32 | *= | __multiplyAssign | Assignment |
| 33 | /= | __divideAssign | Assignment |
| 34 | %= | __modulusAssign | Assignment |
| 35 | <<= | __leftShiftAssign | Assignment |
| 36 | >>= | __rightShiftAssign | Assignment |
| 37 | >>>= | __zeroFillRightShiftAssign | Assignment |
| 38 | &= | __andAssign | Assignment |
| 39 | \|= | __orAssign | Assignment |
| 40 | ^= | __xorAssign | Assignment |


##Design Consideration / Very IMP / Must Read##

It is **very important** that we **DON'T modify the natural language**. Hence the overloading feature will only be available in the specific code blocks where you intend to use it. Also marking them will make core readable for future developers giving them hint that this block has **operator overloading enabled**.

Also operator overloading ***only applies to lexical scope***, no used or inherited objects are enriched. This is important for code security and assurance of natural operation.

###Definig the context for using operator-overloading##

You need to specify a function and mark it such that operator overloading is enabled for code only in lexical scope of that function body.

**Syntax 1: Simple declaration**
```javascript
var doStuff = function(){
   //Here you can enjoy operator overloading.
}.enableOverloading();
//Nothing is overloaded outside the context of marked function above.
//Run it
doStuff();
```

**Syntax 2: Anonymous declaration**
```javascript
(function(){
   //Here you can enjoy operator overloading.
}.enableOverloading())();
//Nothing is overloaded outside the context of marked function above.
```

**Syntax 3: Dual Flavour declaration**
```javascript

function add(a, b){
    return a + b;
};

//Now get another function with operator overloading enabled.
var addWithOverloadingEnabled = add.enableOverloading();

//Call with native operator results (Natural)
add(2, 2);

//Call with overloaded operators
addWithOverloadingEnabled(2, 2);
//Another way
add.enableOverloading()(2, 2);

//Call with native operator results (Natural)
add(2, 2); //Original method will be untouched always.
```

##Understanding restricted scope inheritance##
It is very important that we don,t write code which could mess up natural way of happings and make things harder for debug. Hence the functions we mark with enabled operator-overloading have completely different running contexts.
Those functions can't use variables defined outside the overloaded function such that we don't accidently do stuff to the code which is intended to be executed in the natural way.

**Example**
```javascript
```

##Examples / Usage Guide##
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
        var v1 = new Count(10);
        var v2 = new Count(20);
        var v3 = new Count(30);

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