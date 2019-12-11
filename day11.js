const { runMachine, createStateFromFile } = require('./intcode');

const DIRS = ['N', 'E', 'S', 'W'];

function run(fileName) {
  const state = createStateFromFile(fileName);
  const mach = runMachine(state);

  let pos = { x: 0, y: 0 };
  let dir = 'N';

  let out = mach.next();

  if (out.value !== 'in') {
    throw "Expected input";
  }

  const painted = new Map();
  painted.set(hashPos(pos), 1);

  while (!out.done) {
    const color = painted.get(hashPos(pos)) || 0;
    const newColor = mach.next(color).value;
    const newDirCode = mach.next().value;
    dir = getNewDir(dir, newDirCode);
    painted.set(hashPos(pos), newColor);
    pos = addPos(pos, dirToPositionMod(dir));
    out = mach.next();
  }

  const [start, end] = getRange(painted);
  console.log(painted);

  for (let i = start.y; i <= end.y; i++) {
    let row = [];
    for (let j = start.x; j <= end.x; j++) {
      const val = painted.get(hashPos({ x: j, y: i })) || 0;
      row.push(val ? '#' : ' ');
    }
    console.log(row.join(''));
  }
}

function getNewDir(dir, output) {
  if (typeof dir !== 'string') {
    throw 'Dir not string';
  }
  if (typeof output !== 'number') {
    throw 'output not number'
  }
  const idx = DIRS.indexOf(dir);
  const add = output === 0 ? -1 : 1;
  let newIdx = (idx + add) % DIRS.length;
  if (newIdx < 0) {
    newIdx = DIRS.length - 1;
  }
  return DIRS[newIdx];
}

function hashPos({ x, y }) {
  return `${x},${y}`;
}

function dirToPositionMod(dir) {
  switch (dir) {
    case 'N':
      return { x: 0, y: 1 };
    case 'E':
      return { x: 1, y: 0 };
    case 'S':
      return { x: 0, y: -1 };
    case 'W':
      return { x: -1, y: 0 };
  }
  throw 'Dir not implemented';
}

function addPos({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  return { x: x1 + x2, y: y1 + y2 }
}

function getRange(painted) {
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;
  for (const key of painted.keys()) {
    const [x, y] = key.split(',').map(i => +i);
    minX = Math.min(x, minX);
    maxX = Math.max(x, maxX);
    minY = Math.min(y, minY);
    maxY = Math.max(y, maxY);
  }
  return [{ x: minX, y: minY }, { x: maxX, y: maxY }];
}

run('day11.txt')