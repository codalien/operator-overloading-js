var assert = require("assert");
var overload = require('../lib/overload');
console.log('overload', overload);
describe('Operator overloading Test Suite', function () {

    before(function (done) {
        this.timeout(10000);
        
        global.assertEqual = function (a1, a2) {
            assert.equal(a2, a1);
        };

        //Require the overload js.
        var functionNames = overload.functionNames;
        console.log('functionNames', functionNames);
        Object.keys(functionNames).forEach(function (operator) {
            Number.prototype[functionNames[operator]] = function (lval) {
                var val = this.toString();
                if (lval) return (lval + operator + val);
                else return (operator + val);
            };
            Boolean.prototype[functionNames[operator]] = function (lval) {
                var val = this.toString();
                if (lval) return (lval + operator + val);
                else return (operator + val);
            };
            String.prototype[functionNames[operator]] = function (lval) {
                var val = this.toString();
                if (lval) return (lval + operator + val);
                else return (operator + val);
            };
        });

        done();
    });

    describe('Test Binary Operators', function () {
        it('should overload + operator', function (done) {
            overload(function () {
                assertEqual((33 + 22), '33+22');
            })();
            done();
        });

        it('should overload ** operator', function (done) {
            overload(function () {
                assertEqual((33 ** 22), '33**22');
            })();
            done();
        });

        it('should overload - operator', function (done) {
            overload(function () {
                assertEqual((33 - 22), '33-22');
            })();
            done();
        });

        it('should overload * operator', function (done) {
            overload(function () {
                assertEqual((33 * 22), '33*22');
            })();
            done();
        });

        it('should overload / operator', function (done) {
            overload(function () {
                assertEqual((33 / 22), '33/22');
            })();
            done();
        });

        it('should overload % operator', function (done) {
            overload(function () {
                assertEqual((33 % 22), '33%22');
            })();
            done();
        });

        it('should overload == operator', function (done) {
            overload(function () {
                assertEqual((33 == 22), '33==22');
            })();
            done();
        });

        it('should overload === operator', function (done) {
            overload(function () {
                assertEqual((33 === 22), '33===22');
            })();
            done();
        });

        it('should overload in operator', function (done) {
            overload(function () {
                assertEqual((33 in 22), '33in22');
            })();
            done();
        });

        it('should overload instanceof operator', function (done) {
            overload(function () {
                assertEqual((33 instanceof 22), '33instanceof22');
            })();
            done();
        });

        it('should overload || operator', function (done) {
            overload(function () {
                assertEqual((33 || 22), '33||22');
            })();
            done();
        });

        it('should overload && operator', function (done) {
            overload(function () {
                assertEqual((33 && 22), '33&&22');
            })();
            done();
        });

        it('should overload | operator', function (done) {
            overload(function () {
                assertEqual((33 | 22), '33|22');
            })();
            done();
        });

        it('should overload & operator', function (done) {
            overload(function () {
                assertEqual((33 & 22), '33&22');
            })();
            done();
        });

        it('should overload ^ operator', function (done) {
            overload(function () {
                assertEqual((33 ^ 22), '33^22');
            })();
            done();
        });

        it('should overload < operator', function (done) {
            overload(function () {
                assertEqual((33 < 22), '33<22');
            })();
            done();
        });

        it('should overload > operator', function (done) {
            overload(function () {
                assertEqual((33 > 22), '33>22');
            })();
            done();
        });

        it('should overload <= operator', function (done) {
            overload(function () {
                assertEqual((33 <= 22), '33<=22');
            })();
            done();
        });

        it('should overload >= operator', function (done) {
            overload(function () {
                assertEqual((33 >= 22), '33>=22');
            })();
            done();
        });

        it('should overload << operator', function (done) {
            overload(function () {
                assertEqual((33 << 22), '33<<22');
            })();
            done();
        });

        it('should overload >> operator', function (done) {
            overload(function () {
                assertEqual((33 >> 22), '33>>22');
            })();
            done();
        });

        it('should overload >>> operator', function (done) {
            overload(function () {
                assertEqual((33 >>> 22), '33>>>22');
            })();
            done();
        });

        it('should overload != operator', function (done) {
            overload(function () {
                assertEqual((33 != 22), '33!=22');
            })();
            done();
        });

        it('should overload !== operator', function (done) {
            overload(function () {
                assertEqual((33 !== 22), '33!==22');
            })();
            done();
        });
    });

    describe('Test Unary Operators', function () {
        it('should overload u+ operator', function (done) {
            overload(function () {
                assertEqual(+33, 'u+33');
            })();
            done();
        });

        it('should overload u- operator', function (done) {
            overload(function () {
                assertEqual(-33, 'u-33');
            })();
            done();
        });

        it('should overload ~ operator', function (done) {
            overload(function () {
                assertEqual(~33, '~33');
            })();
            done();
        });

        it('should overload ++ operator', function (done) {
            overload(function () {
                var v = 33;
                assertEqual(++v, '++33');
            })();
            done();
        });

        it('should overload ++ operator', function (done) {
            overload(function () {
                var v = 33;
                assertEqual(v++, '++33');
            })();
            done();
        });

        it('should overload -- operator', function (done) {
            overload(function () {
                var v = 33;
                assertEqual(--v, '--33');
            })();
            done();
        });

        it('should overload -- operator', function (done) {
            overload(function () {
                var v = 33;
                assertEqual(v--, '--33');
            })();
            done();
        });

        it('should overload ! operator', function (done) {
            overload(function () {
                assertEqual(!33, '!33');
            })();
            done();
        });
    });

    describe('Test Assignment Operators', function () {
        it('should overload += operator', function (done) {
            overload(function () {
                var r = 33;
                r += 33 + 22;
                assertEqual(r, '33+22+=33');
            })();
            done();
        });
        it('should overload -= operator', function (done) {
            overload(function () {
                var r = 33;
                r -= 33 + 22;
                assertEqual(r, '33+22-=33');
            })();
            done();
        });
        it('should overload *= operator', function (done) {
            overload(function () {
                var r = 33;
                r *= 33 + 22;
                assertEqual(r, '33+22*=33');
            })();
            done();
        });
        it('should overload /= operator', function (done) {
            overload(function () {
                var r = 33;
                r /= 33 + 22;
                assertEqual(r, '33+22/=33');
            })();
            done();
        });
        it('should overload %= operator', function (done) {
            overload(function () {
                var r = 33;
                r %= 33 + 22;
                assertEqual(r, '33+22%=33');
            })();
            done();
        });
        it('should overload <<= operator', function (done) {
            overload(function () {
                var r = 33;
                r <<= 33 + 22;
                assertEqual(r, '33+22<<=33');
            })();
            done();
        });
        it('should overload >>= operator', function (done) {
            overload(function () {
                var r = 33;
                r >>= 33 + 22;
                assertEqual(r, '33+22>>=33');
            })();
            done();
        });
        it('should overload >>>= operator', function (done) {
            overload(function () {
                var r = 33;
                r >>>= 33 + 22;
                assertEqual(r, '33+22>>>=33');
            })();
            done();
        });
        it('should overload &= operator', function (done) {
            overload(function () {
                var r = 33;
                r &= 33 + 22;
                assertEqual(r, '33+22&=33');
            })();
            done();
        });
        it('should overload |= operator', function (done) {
            overload(function () {
                var r = 33;
                r |= 33 + 22;
                assertEqual(r, '33+22|=33');
            })();
            done();
        });
        it('should overload &= operator', function (done) {
            overload(function () {
                var r = 33;
                r &= 33 + 22;
                assertEqual(r, '33+22&=33');
            })();
            done();
        });
        it('should overload ^= operator', function (done) {
            overload(function () {
                var r = 33;
                r ^= 33 + 22;
                assertEqual(r, '33+22^=33');
            })();
            done();
        });
    });

    describe('Test Functional scope', function () {
        it('should overload only in scoped functions', function (done) {
            assertEqual(33 + 22, 55);
            assertEqual(3 * 2, 6);
            overload(function () {
                assertEqual(33 + 22, '33+22');
                assertEqual(3 * 2, '3*2');
            })();
            done();
        });
        it('should overload only in explicitly scoped functions', function (done) {
            assertEqual(33 + 22, 55);
            assertEqual(3 * 2, 6);
            (function () {
                assertEqual(33 + 22, 55);
                assertEqual(3 * 2, 6);
            })();
            overload(function () {
                assertEqual(33 + 22, '33+22');
                assertEqual(3 * 2, '3*2');
            })();
            done();
        });
    });

    describe('Test Combo operators', function () {
        it('should overload complex chains', function (done) {
            overload(function () {
                var v1 = 33, v2 = 22, d = new Date();
                var t = v1 + v2 * (!v1 || !v2 && 22) + 33 * 55 / ((4 | ~555) * ~~v2 * +d);
                assertEqual('33+22*!33||!22&&22+33*55/4|~555*~~22*%ts%'.replace('%ts%', +d), t);
            })();
            done();
        });
        it('should overload ~~ operator combo', function (done) {
            overload(function () {
                assertEqual(~~33, '~~33');
                assertEqual(~~~33, '~~~33');
                assertEqual(~~~~33, '~~~~33');
            })();
            done();
        });
    });

    describe('Test Scope inheritance', function () {
        it('should not inherit scope', function (done) {
            var a = 33;
            overload(function () {
                assertEqual(typeof a, 'undefined');
            })();
            done();
        });
        it('should accept parameters', function (done) {
            var a = 33;
            overload(function (a) {
                assertEqual(typeof a, 'number');
                assertEqual(a, 33);
            })(a);
            done();
        });
    });

    describe('Test Code traversal in AST', function () {

    });

    describe('Test Global', function () {
        require('./../global');
        
        it('should equal overload', function () {
            assertEqual(Function.prototype.enableOverloading, overload);
        });
    });

    after(function () {

    });
});