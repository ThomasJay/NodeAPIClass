console.log("Hello Node");

var c = "He ha";

function myFunc() {
	console.log("In myfunc");
}

var xMyFunc = function myFuncX(a, b) {
	var c = a + " " + b;
	console.log("In myFuncX a=" + a + " b=" + b + " c=" + c);
}


myFunc();


xMyFunc("Hi", 123);


var person = {
	firstName : "Tom",
	lastName : "Jay",
	age : 16
};

console.log("Person=" + JSON.stringify(person));


var printMe = function() {
	console.log("Me");
}

setTimeout(printMe, 2000);

	console.log("Global c=" + c);

