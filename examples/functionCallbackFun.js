'use strict';

require('../lib/overload');

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