const fs = require("fs");

function run(file) {
  const input = readInput(file);

  let maxSeen = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === "#") {
        const res = countRoids(input, i, j);
        maxSeen = Math.max(res, maxSeen);
      }
    }
  }

  console.log(maxSeen);
}

function countRoids(input, x, y) {
  const slopes = new Set();
  let state = "before";
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (x === i && y === j) {
        state = "after";
        continue;
      }
      if (input[i][j] === "#") {
        const slope = (i - x) / (j - y);
        slopes.add(slope + state);
      }
    }
  }
  return slopes.size;
}

function readInput(fileName) {
  const str = fs.readFileSync(fileName, "utf8");
  return str.split("\n").map(line => line.split(""));
}

run("day10.txt");
