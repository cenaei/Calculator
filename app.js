var numbers = "";
const body = document.querySelector("body");
const input = document.querySelector("#input");
const output = document.querySelector("#output");

function show(num) {
  input = num;
  output = num;
}

function add(val) {
  input += val;
  show(input);
}

function c() {
  numbers = "";
  show(numbers);
}

function point() {

}

// function ne() {
// }

function calc() {
  eval(numbers);
}

// function data(value) {
//   calculator.display.value += value
// }

// function ac(){
//   calculator.display.value = ""
// }

// function c(){
//   calculator.display.value = calculator.display.value.slice(0,-1)
// }

// function result(){
//   calculator.display.value = eval(calculator.display.value)
// }