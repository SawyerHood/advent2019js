const { runMachine, createStateFromFile } = require("./intcode");

function main() {
  const state = createStateFromFile("day13.txt");
  const mach = runMachine(state);
  const world = new Map();
  let out = mach.next();
  while (!out.done) {
    x = out.value;
    out = mach.next();
    y = out.value;
    out = mach.next();
    tile = out.value;
    world.set(`${x},${y}`, tile);
    out = mach.next();
  }

  console.log(Array.from(world.values()).filter(v => v === 2).length);
}

main();
