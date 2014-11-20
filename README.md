**Table of Contents**

- [Operator-Overloading-JS](#operator-overloading-js)
  - [Installation](#installation)
    - [Node Module (NPM)](#node-module-npm)
    - [Browser (Bower)](#browser-bower)
  - [Sneak Peak Example](#sneak-peak-example)
  - [Overloadable Operators](#overloadable-operators)
  - [Design Consideration / Very IMP / Must Read](#design-consideration--very-imp--must-read)
    - [Definig the context for using operator-overloading](#definig-the-context-for-using-operator-overloading)
    - [Understanding restricted scope inheritance](#understanding-restricted-scope-inheritance)
  - [Usage Guide](#usage-guide)
    - [Overloading binary/assignment operators](#overloading-binaryassignment-operators)
    - [Overloading unary operators](#overloading-unary-operators)
    - [Using the overloaded operators](#using-the-overloaded-operators)
  - [Examples](#examples)
    - [Simple Student Constructor](#simple-student-constructor)
    - [Function Callback Fun](#function-callback-fun)
    - [Instanceof for Serialized objects](#instanceof-for-serialized-objects)
    - [Playground](#playground)
  - [Dev Tips](#dev-tips)
  - [Revision History](#revision-history)


#Operator-Overloading-JS#

This library enables simple **operator overloading** in Javascript code.
This library has minimal runtime overheads, all overheads are done on loading time which is fair as that is done only when the system loads. Runtime performance is what is aimed for.
We do **AST Transformations** during definition/load time to achieve the desired objective.


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

###Understanding restricted scope inheritance###
It is very important that we don,t write code which could mess up natural way of happings and make things harder for debug. Hence the functions we mark with enabled operator-overloading have completely different running contexts.
Those functions can't use variables defined outside the overloaded function such that we don't accidently do stuff to the code which is intended to be executed in the natural way.

**Example**
```javascript
var a = 222;

//But if we have anything in global(node)/window(browser) scope that is accessible
global.b = 333;

console.log(a); //Output: 222
console.log(b); //Output: 333

//Now this function has its own isolated execution context/scope.
(function(){
    //You can't access the objects outside the function even in lexical scope.
    console.log(a); //Output: ERROR: a is undefined

    //But you can access global/window scope
    console.log(b); //Output: 333
}.enableOverloading())();
```

**Example: If you need to access some objects, you can do:**
```javascript
var a = 222;

console.log(a); //Output: 222

//Now this function has its own isolated execution context/scope.
(function(a){
    console.log(a); //Output: 222
}.enableOverloading())(a); //Pass them as arguments ;)
```


##Usage Guide##

There are two steps required to use operator overloading:
1. Define overloading methods for operators intended to overload.
2. Use them in a special context.

Objects should have desired methods for the operators to overload. The method you should override can be chosen from [Overloadable Operators](#overloadable-operators). For different operators its explained as follows:

###Overloading binary/assignment operators###
For binary operators syntax is as follows:

**NOTE:** In the overloading functions `this` is the *RightValue(rval)* and `argument (leftValue)` is the *LeftValue(lval)*. Ex: in `2 + 3`, `lval = 2` and `rval = 3`.

```javascript
<AnyConstructor>.prototype.__plus = function(leftValue){
    //Do magic...here
    //...
    //...
    return <whateverYouWantToDoAndReturnAsResult>;
};
```
**OR**
```javascript
<AnyObject>.__plus = function(leftValue){
    //Do magic...here
    //...
    //...
    return <whateverYouWantToDoAndReturnAsResult>;
};
```
**OR**
```javascript
function MyClass(){
    this.__plus = function(leftValue){
        //Do magic...here
        //...
        //...
        return <whateverYouWantToDoAndReturnAsResult>;
    };
};
```

**EXAMPLE**:
```javascript
Number.prototype.__plus = function(leftValue){
    var rightValue = this;
    console.log('Adding:', leftValue, '+', rightValue);
    return leftValue + rightValue;
};

console.log(22 + 33); //Output: 55

(function(){
    console.log(22 + 33); //Output: Adding: 22 + 33 \n 55
}.enableOverloading())();

```

###Overloading unary operators###
There is no argument passed in these functions as there is no other operand. the operand the unary operator is applied is available in `this` object.

```javascript
<AnyConstructor>.prototype.__increment = function(){
    var operand = this;
    //Do magic...here
    //...
    //...
    return <whateverYouWantToDoAndReturnAsResult>;
};
```
**OR**
```javascript
<AnyObject>.__increment = function(){
    var operand = this;
    //Do magic...here
    //...
    //...
    return <whateverYouWantToDoAndReturnAsResult>;
};
```
**OR**
```javascript
function MyClass(){
    this.__increment = function(){
        var operand = this;
        //Do magic...here
        //...
        //...
        return <whateverYouWantToDoAndReturnAsResult>;
    };
};
```

###Using the overloaded operators###

Whatever function is transformed via `.enableOverloading()` is eligible for operator overloading.

```javascript
var a = 222;

console.log(a); //Output: 222

//Now this function has its own isolated execution context/scope.
(function(a){
    console.log(a); //Output: 222
}.enableOverloading())(a); //Pass them as arguments ;)
```


##Examples##
Some examples:

###Simple Student Constructor###
The same example we have shown above.
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


###Function Callback Fun###
Just a **fun** way to pass callbacks. Just a demonstration experiment.

```javascript
require('operator-overloading');

//Specify behavior for '>>'
Function.prototype.__bitwiseRSHIFT = function (leftOperand) {
    return leftOperand(this);
};

//Fun time
(function () {

    function callback(data) {
        console.log('final Callback!', data);
    }

    function fetchData(callback) {
        console.log('calling 1');
        setTimeout(function () {
            callback('Operator overloading is FUN!');
        }, 1000)
    }

    //FUN Part here!! This line is equal to fetchData(callback);
    fetchData >> callback;

}.enableOverloading())();
```

###Instanceof for Serialized objects###
Check if serialised object is instance of a particular constructor.

```javascript
require('operator-overloading');

function User(name, age, dob, email) {
    var self = this;
    this.type = this.constructor.name;
    this.name = name;
    this.age = age;
    this.dob = dob;
    this.email = email;
    this.serialize = function () {
        return JSON.stringify(self);
    };
    //Overload. We are overloading User also as operation will also be performed on User constructor as an operand.
    this.__instanceOf = User.__instanceOf = function (obj) {
        if (obj instanceof String || typeof obj === 'string') obj = JSON.parse(obj); //compatibility for serialized JSON too.
        return (obj.type === 'User');
    };
}

function Issue(user, title, description) {
    var self = this;
    this.type = this.constructor.name;
    this.user = user;
    this.title = title;
    this.description = description;
    this.serialize = function () {
        return JSON.stringify(self);
    };
    //Overload. We are overloading User also as operation will also be performed on User constructor as an operand.
    this.__instanceOf = Issue.__instanceOf = function (obj) {
        if (obj instanceof String || typeof obj === 'string') obj = JSON.parse(obj); //compatibility for serialized JSON too.
        return (obj.type == 'Issue');
    };
}

var user1 = new User('Kushal', 22, new Date(), 'email@domain.com');
var issue1 = new Issue(user1, 'Life is not fun!', 'Operator overloading in required in JS.');

var sUser1 = user1.serialize();
var sIssue1 = issue1.serialize();

console.log(sUser1);
console.log(sIssue1);

console.log(sUser1 instanceof User); //Output: false
console.log(sUser1 instanceof Issue); //Output: false
console.log(sIssue1 instanceof User); //Output: false
console.log(sIssue1 instanceof Issue); //Output: false

//try out with overloading
(function (sUser1, sIssue1, User, Issue) {
    //HURRAY!! It Works!
    console.log(sUser1 instanceof User); //Output: true
    console.log(sUser1 instanceof Issue); //Output: false
    console.log(sIssue1 instanceof User); //Output: false
    console.log(sIssue1 instanceof Issue); //Output: true
}.enableOverloading())(sUser1, sIssue1, User, Issue);
```

###Playground###
Just a rough playground.

```javascript
require('operator-overloading');


//An example Constructor Class
function Count(val) {
    var _this = this;
    this.val = val;
    this.__plus = function (leftOperand) {
        console.log("adding Count");
        leftOperand.val += _this.val;
        return this;
    };

    this.__doubleEqual = function (leftOperand) {
        console.log('double Equal Check');
        return _this.val == leftOperand.val;
    };

    this.__tripleEqual = function (leftOperand) {
        console.log('triple Equal Check');
        return _this.val === leftOperand.val;
    };
}

//We can put in Native types too
String.prototype.__plus = function (leftOperand) {
    return (leftOperand + " <added> " + this);
};

//Number example
Number.prototype.__plus = function (leftOperand) {
    console.log('Adding:', leftOperand, '+', this.valueOf());
    return leftOperand + this;
};

var v1 = new Count(10);
var v2 = new Count(20);
var v3 = new Count(30);

//That's how you do it. Ity has its own context scope
var run = function (v1, v2, v3) {

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

    var t = 33 || 44;
    t = 33 && 44;
    t = 33 & 44;
    t = 33 | 44;
    t = 33 ^ 44;
    t = 33 != 44;
    t = 33 !== 44;
    t = 33 < 44;
    t = 33 > 44;
    t = 33 >= 44;
    t = 33 <= 44;
    t = 33 in [44];
    t = 33 instanceof Number;
    t = 33 << 44;
    t = 33 >> 44;
    t = 33 >>> 44;
    t = 33 - 44;
    t = 33 * 44;
    t = 33 / 44;
    t = 33 % 44;
    t = -44;
    t = +44;
    t = ~44;
    t = ++v1;
    t = --v1;
    t = !v1;
    t += v1;
    t /= !v2;
    t *= !v2;
    t -= !v2;
    t %= !v2;
    t <<= !v2;
    t >>= !v2;
    t >>>= !v2;
    t &= !v2;
    t ^= !v2;
    t |= !v2;
    t = v1 + v2 * (!v1 || !v2 && 22) + 33 * 55 / ((4 | ~555) * ~~v2 * +new Date());
    console.log(t);

}.enableOverloading(); //Do this to enable operator overloading in this function. We don't recommend global enablement as that would be confusing.

//This will be normal operation as defined in JS.
console.log(3 + 44 + 100);

run(v1, v2, v3);
```

##Dev Tips##
For all those who are contributing or once who wants to see debug info can run via:
```bash
 OVERLOAD_DEBUG=true node <program>.js
```
Above will print the **AST** and **transformed code**.


##Revision History##
* **Version 0.1**: The first poc release overloading only +-*/ operators.
* **Version 0.2**: Added support for all binary operators and unary operators.
* **Version 0.3**: Updated AST Traversal to enable inline inner functions.
* **Version 0.4**: Added support for assignment operators.