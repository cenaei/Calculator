var numbers = "";
const input = document.getElementById("input");
const output = document.getElementById("output");

function show() {
  input.value = numbers;
}

function add(val) {
  input+=val;
  show();
}

function c() {
  numbers = "";
  show();
}

// function ne() {
// }

function calc() {
  eval(numbers);
}