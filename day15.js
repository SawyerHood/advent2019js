const { createStateFromFile, runMachine } = require("./intcode.js");

const NORTH = 1;
const SOUTH = 2;
const WEST = 3;
const EAST = 4;

function run() {
  const state = createStateFromFile("day15.txt");
  const mach = runMachine(state);
  mach.next();
  search(mach);
}

function search(mach) {
  const world = new Map([["0,0", 1]]);

  let minX = 0;
  let minY = 0;
  let maxX = 0;
  let maxY = 0;

  function dfs([x, y]) {
    const nHash = hash([x, y + 1]);
    const sHash = hash([x, y - 1]);
    const wHash = hash([x - 1, y]);
    const eHash = hash([x + 1, y]);
    minX = Math.min(x, minX);
    minY = Math.min(y, minY);
    maxY = Math.max(y, maxY);
    maxX = Math.max(x, maxX);
    if (!world.has(nHash)) {
      const status = mach.next(NORTH).value;
      mach.next();
      world.set(nHash, status);
      if (status !== 0) {
        dfs([x, y + 1]);
        mach.next(SOUTH);
        mach.next();
      }
    }
    if (!world.has(sHash)) {
      const status = mach.next(SOUTH).value;
      mach.next();
      world.set(sHash, status);
      if (status !== 0) {
        dfs([x, y - 1]);
        mach.next(NORTH);
        mach.next();
      }
    }
    if (!world.has(wHash)) {
      const status = mach.next(WEST).value;
      mach.next();
      world.set(wHash, status);
      if (status !== 0) {
        dfs([x - 1, y]);
        mach.next(EAST);
        mach.next();
      }
    }
    if (!world.has(eHash)) {
      const status = mach.next(EAST).value;
      mach.next();
      world.set(eHash, status);
      if (status !== 0) {
        dfs([x + 1, y]);
        mach.next(WEST);
        mach.next();
      }
    }
  }

  dfs([0, 0]);

  console.log(getTime(world));

  //   for (let j = minY; j < maxY; j++) {
  //     const row = [];
  //     for (let i = minX; i < maxX; i++) {
  //       const tile = world.get(hash([i, j]));
  //       if (!tile) {
  //         row.push("#");
  //       } else if (tile === 2) {
  //         row.push("@");
  //       } else {
  //         row.push(".");
  //       }
  //     }
  //     console.log(row.join(""));
  //   }
}

function getMoves(world) {
  const queue = [{ pos: [0, 0], dist: 0 }];
  while (queue.length) {
    const {
      dist,
      pos: [x, y]
    } = queue.shift();
    const tile = world.get(hash([x, y]));
    if (!tile) {
      continue;
    } else if (tile === 2) {
      console.log([x, y]);
      return dist;
    }

    world.set(hash([x, y]), 0);

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        const newPos = [x + i, y + j];
        if (Math.abs(i) !== Math.abs(j) && world.get(hash(newPos))) {
          queue.push({ pos: newPos, dist: dist + 1 });
        }
      }
    }
  }
}

function getTime(world) {
  const queue = [{ pos: [-16, 14], dist: 0 }];
  let maxDist = 0;
  while (queue.length) {
    const {
      dist,
      pos: [x, y]
    } = queue.shift();
    const tile = world.get(hash([x, y]));
    if (!tile) {
      continue;
    }

    maxDist = Math.max(dist, maxDist);

    world.set(hash([x, y]), 0);

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        const newPos = [x + i, y + j];
        if (Math.abs(i) !== Math.abs(j) && world.get(hash(newPos))) {
          queue.push({ pos: newPos, dist: dist + 1 });
        }
      }
    }
  }

  return maxDist;
}

function hash(pos) {
  return `${pos[0]},${pos[1]}`;
}

run();
