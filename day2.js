const INPUT =
  "1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,1,9,19,1,10,19,23,2,9,23,27,1,6,27,31,2,31,9,35,1,5,35,39,1,10,39,43,1,10,43,47,2,13,47,51,1,10,51,55,2,55,10,59,1,9,59,63,2,6,63,67,1,5,67,71,1,71,5,75,1,5,75,79,2,79,13,83,1,83,5,87,2,6,87,91,1,5,91,95,1,95,9,99,1,99,6,103,1,103,13,107,1,107,5,111,2,111,13,115,1,115,6,119,1,6,119,123,2,123,13,127,1,10,127,131,1,131,2,135,1,135,5,0,99,2,14,0,0";

function parseString(str) {
  return str.split(",").map(s => +s);
}

const ADD = 1;
const MULT = 2;
const HALT = 99;

function runMachine(state) {
  for (let i = 0; i < state.length && state[i] !== 99; i += 4) {
    const op = state[i];
    const firstPtr = state[i + 1];
    const secondPtr = state[i + 2];
    const resPtr = state[i + 3];

    let res;
    if (op === ADD) {
      state[resPtr] = state[firstPtr] + state[secondPtr];
    } else if (op === MULT) {
      state[resPtr] = state[firstPtr] * state[secondPtr];
    }
  }
}

function runInput(str) {
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      const state = parseString(str);
      state[1] = i;
      state[2] = j;
      runMachine(state);
      if (state[0] === 19690720) {
        console.log(`ANSWER: ${100 * i + j}`);
        return;
      }
    }
  }

  console.log(state[0]);
}

runInput(INPUT);
