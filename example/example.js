require('../../overload-js');


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

//That's how you do it. It has its own context scope
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

}.enableOverloading(); //Do this to enable operator overloading in this function. We don't recommend global enablement as that would be confusing.

//This will be normal operation as defined in JS.
console.log(3 + 44 + 100);

run(v1, v2, v3);
