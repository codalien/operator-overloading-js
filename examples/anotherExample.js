require('../lib/overload');


Function.prototype.__bitwiseRSHIFT = function (leftOperand) {
    return leftOperand(this);
};

function fetchData1(callback) {
    console.log('calling 1');
    setTimeout(function () {
        callback();
    }, 1000)
}

function fetchData2(callback) {
    console.log('calling 2');
    setTimeout(function () {
        callback();
    }, 1000)
}

function fetchData3(callback) {
    console.log('calling 3');
    setTimeout(function () {
        callback();
    }, 1000)
}

function callback() {
    console.log('finalCallback!');
}

/*
(function (ka, ku, d, r, v) {
//    var resp = fetchData1 >> callback*/
/* >> fetchData3 >> callback*//*
;

    console.log(ka + ku + v);
    console.log(ka + ku + v + r);
    console.log(ka + ku + v + r + d);
    console.log(r + d);
    console.log(r + d + ka);

}.enableOverloading())(
        new Student('Kashish', 60),
        new Student('Kushal', 33),
        new Student('Dheeraj', 90),
        new Student('Rishabh', 25),
        new Student('Vibhor', 80)
    );
*/


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

}.enableOverloading()/*Here you are enabling overloading for this context only*/)();