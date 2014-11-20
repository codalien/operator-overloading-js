'use strict';

require('../lib/overload');

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