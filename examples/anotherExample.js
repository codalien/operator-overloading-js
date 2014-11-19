require('../../overload-js');


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

(function (ka, ku, d, r, v) {
//    var resp = fetchData1 >> callback/* >> fetchData3 >> callback*/;

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

function Student(name, marks) {
    var _this = this;
    this.name = name;
    this.marks = marks;
    this.__plus = function (leftOperand) {
        return new Student([leftOperand.name, _this.name].join('+'), leftOperand.marks + _this.marks);
    };
}

