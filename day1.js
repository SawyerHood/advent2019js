const fs = require("fs");

function readLines(fileName) {
  return fs.readFileSync(fileName, "utf8").split("\n");
}

function run() {
  const lines = readLines("day1.txt");
  const result = lines.map(computeMass).reduce((a, b) => a + b, 0);

  console.log(result);
}

function calcFuel(mass) {
  return Math.max(Math.floor(mass / 3) - 2, 0);
}

function computeMass(line) {
  mass = +line;
  let total = 0;
  let lastFuel = mass;
  do {
    lastFuel = calcFuel(lastFuel);
    total += lastFuel;
  } while (lastFuel > 0);
  return total;
}

function test() {
  expectEquals(computeMass(14), 2);
  expectEquals(computeMass(1969), 966);
}

function expectEquals(input, correct) {
  if (input !== correct) {
    console.error(`Expected: ${correct} got ${input}`);
  }
}

run();
