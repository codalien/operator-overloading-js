require('../lib/overload');

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