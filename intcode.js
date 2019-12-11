const fs = require("fs");

function createStateFromFile(fileName) {
    const res = parseString(fs.readFileSync(fileName, "utf8"));
    res.relAddr = 0;
    return res;
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
const REL_BASE = 9;
const HALT = 99;

function* runMachine(state) {
    let i = 0;
    while (i < state.length && state[i] !== HALT) {
        const opCode = state[i];
        const firstVal = state[i + 1];
        const secondVal = state[i + 2];
        const thirdVal = state[i + 3];

        const [op, m1, m2, m3] = parseOpCode(opCode);
        switch (op) {
            case ADD: {
                i += 4;

                writeVal(
                    state,
                    thirdVal,
                    m3,
                    fetchVal(state, firstVal, m1) + fetchVal(state, secondVal, m2)
                );
                break;
            }
            case MULT: {
                i += 4;

                writeVal(
                    state,
                    thirdVal,
                    m3,
                    fetchVal(state, firstVal, m1) * fetchVal(state, secondVal, m2)
                );
                break;
            }
            case IN: {
                i += 2;
                writeVal(state, firstVal, m1, yield "in");
                break;
            }
            case OUT: {
                i += 2;
                const val = fetchVal(state, firstVal, m1);
                yield val;
                break;
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
                const x = fetchVal(state, firstVal, m1);
                const y = fetchVal(state, secondVal, m2);
                writeVal(state, thirdVal, m3, x < y ? 1 : 0);
                break;
            }
            case EQUALS: {
                i += 4;
                const x = fetchVal(state, firstVal, m1);
                const y = fetchVal(state, secondVal, m2);
                writeVal(state, thirdVal, m3, x === y ? 1 : 0);
                break;
            }
            case REL_BASE: {
                i += 2;
                state.relAddr += fetchVal(state, firstVal, m1);
                break;
            }
        }
    }
}

function fetchVal(state, val, mode) {
    if (mode === 1) {
        return val;
    } else if (mode === 2) {
        return state[val + state.relAddr] || 0;
    }
    return state[val] || 0;
}

function writeVal(state, val, mode, toPut) {
    if (mode === 1) {
        return;
    } else if (mode === 0) {
        state[val] = toPut;
    } else if (mode === 2) {
        state[state.relAddr + val] = toPut;
    }
}

function parseOpCode(code) {
    const op = (code % 10) + Math.floor((code % 100) / 10);
    const p1 = Math.floor((code % 1000) / 100);
    const p2 = Math.floor((code % 10000) / 1000);
    const p3 = Math.floor((code % 100000) / 10000);
    return [op, p1, p2, p3];
}

module.exports = {
    createStateFromFile,
    runMachine
}