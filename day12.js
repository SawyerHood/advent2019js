const fs = require("fs");

function main() {
  const planets = readInput("day12.txt");
  for (let i = 0; i < 1000; i++) {
    step(planets);
  }

  const energy = sum(planets.map(p => sum(p.pos) * sum(p.vel)));
  console.log(energy);
}

function sum(arr) {
  return arr.map(n => Math.abs(n)).reduce((a, b) => a + b, 0);
}

function step(planets) {
  for (const p1 of planets) {
    for (const p2 of planets) {
      if (p1 === p2) {
        continue;
      }

      for (let i = 0; i < p1.pos.length; i++) {
        if (p1.pos[i] > p2.pos[i]) {
          p1.vel[i]--;
        } else if (p1.pos[i] < p2.pos[i]) {
          p1.vel[i]++;
        }
      }
    }
  }

  for (const p of planets) {
    for (let i = 0; i < p.pos.length; i++) {
      p.pos[i] += p.vel[i];
    }
  }
}

function readInput(fileName) {
  const str = fs.readFileSync(fileName, "utf8");
  return str
    .split("\n")
    .map(parseLine)
    .map(createPlanet);
}

function parseLine(line) {
  return line
    .replace(/[<>=xyz]/g, "")
    .split(",")
    .map(i => +i);
}

function createPlanet(pos) {
  return { pos, vel: [0, 0, 0] };
}

main();
