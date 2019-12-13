const { runMachine, createStateFromFile } = require("./intcode");

function main() {
  const state = createStateFromFile("day13.txt");
  const mach = runMachine(state);
  const world = new Map();
  let out = mach.next();
  while (!out.done) {
    if (out.value === "in") {
      print(world);
      console.log();
      let paddleX;
      let ballX;
      for (const [pos, tile] of world.entries()) {
        const [x, y] = pos.split(",").map(n => +n);
        if (tile === 3) {
          paddleX = x;
        } else if (tile === 4) {
          ballX = x;
        }
      }

      if (paddleX == null || ballX == null) {
        out = mach.next(0);
      } else if (paddleX > ballX) {
        out = mach.next(-1);
      } else if (paddleX < ballX) {
        out = mach.next(1);
      } else {
        out = mach.next(0);
      }
      continue;
    }
    x = out.value;
    out = mach.next();
    y = out.value;
    out = mach.next();
    tile = out.value;

    if (x === -1 && y === 0) {
      console.log(tile);
    } else {
      world.set(`${x},${y}`, tile);
    }
    out = mach.next();
  }
}

function print(world) {
  const arr = [];
  for (const [pos, tile] of world.entries()) {
    const [x, y] = pos.split(",").map(n => +n);
    arr[y] = arr[y] || [];
    arr[y][x] = +tile;
  }

  for (let row of arr) {
    const line = row.join("");
    console.log(line);
  }
}

main();
