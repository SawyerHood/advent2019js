const fs = require("fs");

function main() {
  let input = readInput("day16.txt").repeat(10000);
  let toSkip = +input.substr(0, 7);
  input = input
    .substring(toSkip)
    .split("")
    .map(n => +n);

  for (let i = 0; i < 100; i++) {
    input = step(input);
    console.log(i);
  }
  console.log(input.slice(0, 8).join(""));
}

function step(input) {
  const output = new Array(input.length);
  for (let digit = input.length - 1; digit >= 0; digit--) {
    output[digit] = (input[digit] + (output[digit + 1] || 0)) % 10;
  }
  return output;
}

function readInput(fileName) {
  return fs.readFileSync(fileName, "utf8");
}

function* genPattern(digit, offset) {
  const basePattern = [0, 1, 0, -1];
  let j = Math.floor(offset / digit);
  let i = offset % digit;
  while (true) {
    while (j < basePattern.length) {
      while (i < digit) {
        yield signal;
        i++;
      }
      i = 0;
      j++;
    }
    j = 0;
  }
}

main();
