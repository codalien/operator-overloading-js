*Oveload-JS*

This library enables simple operator overloading in Javascript code. This library has minimal runtime overheads, all overheads are done on loading time which is fair as that is done only when the system loads. Runtime performance is what is aimed for.

**Example**
```javascript

require('../../overload-js');


//An example Constructor Class
function Count(val) {
    var _this = this;
    this.val = val;
    this.plus = function (operand) {
        console.log("adding Count");
        _this.val += operand.val;
    };

    this.doubleEqual = function (operand) {
        console.log('double Equal Check')
        return _this.val == operand.val;
    };

    this.tripleEqual = function(operand) {
        console.log('triple Equal Check');
        return _this.val === operand.val;
    };
}

//We can put in Native types too
String.prototype.plus = function (o) {
    return (this + " <added> " + o);
};

//Number example
Number.prototype.plus = function (operand) {
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

}.enableOverloading(); //Do this to enable operator overloading in this function. We don't recommend global enablement as that would be confusing.

run();


```