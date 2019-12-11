const fs = require("fs");

function run(fileName) {
  const initialState = createStateFromFile(fileName);
  const perms = getAllPermutations("01234");
  let max = 0;
  let maxSignal;
  for (const perm of perms) {
    const res = runAmps(
      initialState,
      perm.split("").map(c => +c)
    );
    if (res > max) {
      max = res;
      maxSignal = perm;
    }
  }
  console.log(max);
}

function runAmps(state, phaseSettings) {
  let input = 0;
  const machines = phaseSettings.map(s => {
    const gen = runMachine([...state]);
    gen.next();
    const lastVal = gen.next(s).value;
    return { gen, lastVal, isDone: false };
  });

  while (!machines[machines.length - 1].isDone) {
    for (const mach of machines) {
      if (mach.isDone) {
        continue;
      }
      let res = mach.gen.next(input);
      input = res.value;
      mach.gen.next();
      mach.lastVal = res.value;
      mach.isDone = res.done;
    }
  }

  return input;
}

function getAllPermutations(string) {
  var results = [];

  if (string.length === 1) {
    results.push(string);
    return results;
  }

  for (var i = 0; i < string.length; i++) {
    var firstChar = string[i];
    var charsLeft = string.substring(0, i) + string.substring(i + 1);
    var innerPermutations = getAllPermutations(charsLeft);
    for (var j = 0; j < innerPermutations.length; j++) {
      results.push(firstChar + innerPermutations[j]);
    }
  }
  return results;
}

function createStateFromFile(fileName) {
  return parseString(fs.readFileSync(fileName, "utf8"));
}

function parseString(str) {
  return str.split(",").map(s => +s);
}

const ADD = 1;
const MULT = 2;
const IN = 3;
const OUT = 4;
const IF_TRUE = 5;
const IF_FALSE = 6;
const LESS_THAN = 7;
const EQUALS = 8;
const HALT = 99;

function runMachine(state, inputs) {
  let i = 0;
  let inputIndex = 0;
  while (i < state.length && state[i] !== HALT) {
    const opCode = state[i];
    const firstVal = state[i + 1];
    const secondVal = state[i + 2];
    const thirdVal = state[i + 3];

    const [op, m1, m2, m3] = parseOpCode(opCode);
    debugger;
    switch (op) {
      case ADD: {
        i += 4;
        if (m3) {
          continue;
        }
        state[thirdVal] =
          fetchVal(state, firstVal, m1) + fetchVal(state, secondVal, m2);
        break;
      }
      case MULT: {
        i += 4;
        if (m3) {
          continue;
        }
        state[thirdVal] =
          fetchVal(state, firstVal, m1) * fetchVal(state, secondVal, m2);
        break;
      }
      case IN: {
        i += 2;
        if (m1) {
          continue;
        }
        state[firstVal] = inputs[inputIndex];
        inputIndex++;
        break;
      }
      case OUT: {
        i += 2;
        const val = fetchVal(state, firstVal, m1);
        return val;
      }
      case IF_TRUE: {
        i += 3;
        const cond = fetchVal(state, firstVal, m1);
        if (cond != 0) {
          i = fetchVal(state, secondVal, m2);
        }
        break;
      }
      case IF_FALSE: {
        i += 3;
        const cond = fetchVal(state, firstVal, m1);
        if (cond == 0) {
          i = fetchVal(state, secondVal, m2);
        }
        break;
      }
      case LESS_THAN: {
        i += 4;
        if (m3) {
          continue;
        }
        const x = fetchVal(state, firstVal, m1);
        const y = fetchVal(state, secondVal, m2);
        state[thirdVal] = x < y ? 1 : 0;
        break;
      }
      case EQUALS: {
        i += 4;
        if (m3) {
          continue;
        }
        const x = fetchVal(state, firstVal, m1);
        const y = fetchVal(state, secondVal, m2);
        state[thirdVal] = x === y ? 1 : 0;
        break;
      }
    }
  }
}

function fetchVal(state, val, mode) {
  if (mode) {
    return val;
  }
  return state[val];
}

function parseOpCode(code) {
  const op = (code % 10) + Math.floor((code % 100) / 10);
  const p1 = Math.floor((code % 1000) / 100);
  const p2 = Math.floor((code % 10000) / 1000);
  const p3 = Math.floor((code % 100000) / 10000);
  return [op, p1, p2, p3];
}

run("day7.txt");
