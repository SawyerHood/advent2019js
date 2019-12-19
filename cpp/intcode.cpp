#include <fstream>
#include <iostream>
#include <string>
#include <vector>

#include "intcode.hpp"

const auto ADD = 1;
const auto MULT = 2;
const auto IN = 3;
const auto OUT = 4;
const auto IF_TRUE = 5;
const auto IF_FALSE = 6;
const auto LESS_THAN = 7;
const auto EQUALS = 8;
const auto REL_BASE = 9;
const auto HALT = 99;

Inst parseOpCode(int code) {
  auto op = (code % 10) + (code % 100) / 10;
  auto m1 = (code % 1000) / 100;
  auto m2 = (code % 10000) / 1000;
  auto m3 = (code % 100000) / 10000;
  return Inst{op, m1, m2, m3};
}

Machine::Machine(std::vector<long long> state) { this->state = state; }

Machine Machine::fromFile(std::string fileName) {
  std::vector<long long> vec{};
  std::ifstream infile{fileName};
  long long i;
  char _throw;
  while (infile >> i) {
    infile >> _throw;
    vec.push_back(i);
  }

  return Machine{vec};
}

long long Machine::fetchVal(int value, int mode) {
  if (mode == 1) {
    return value;
  } else if (mode == 2) {
    return value + relAddr < state.size() ? state[value + relAddr] : 0;
  }
  return value < state.size() ? state[value] : 0;
}

void Machine::writeVal(int val, int mode, long long toPut) {
  if (mode == 1) {
    return;
  }

  auto newIndex = mode == 2 ? relAddr + val : val;

  if (newIndex >= state.size()) {
    state.resize(newIndex + 100);
  }
  state[newIndex] = toPut;
}

void Machine::input(long long in) { writeVal(inputVal, inputMode, in); }

RunStatus Machine::run() {
  while (i < state.size() && state[i] != HALT) {
    auto opCode = state[i];
    auto firstVal = state[i + 1];
    auto secondVal = state[i + 2];
    auto thirdVal = state[i + 3];

    auto opInfo = parseOpCode(opCode);
    auto op = opInfo.op;
    auto m1 = opInfo.m1;
    auto m2 = opInfo.m2;
    auto m3 = opInfo.m3;

    switch (op) {
    case ADD: {
      i += 4;
      writeVal(thirdVal, m3, fetchVal(firstVal, m1) + fetchVal(secondVal, m2));
      break;
    }
    case MULT: {
      i += 4;

      writeVal(thirdVal, m3, fetchVal(firstVal, m1) * fetchVal(secondVal, m2));
      break;
    }
    case IN: {
      i += 2;
      inputVal = firstVal;
      inputMode = m1;

      return RunStatus{RunType::INPUT};
    }
    case OUT: {
      i += 2;
      auto val = fetchVal(firstVal, m1);
      return RunStatus{RunType::OUTPUT, val};
    }
    case IF_TRUE: {
      i += 3;
      auto cond = fetchVal(firstVal, m1);
      if (cond != 0) {
        i = fetchVal(secondVal, m2);
      }
      break;
    }
    case IF_FALSE: {
      i += 3;
      auto cond = fetchVal(firstVal, m1);
      if (cond == 0) {
        i = fetchVal(secondVal, m2);
      }
      break;
    }
    case LESS_THAN: {
      i += 4;
      auto x = fetchVal(firstVal, m1);
      auto y = fetchVal(secondVal, m2);
      writeVal(thirdVal, m3, x < y ? 1 : 0);
      break;
    }
    case EQUALS: {
      i += 4;
      auto x = fetchVal(firstVal, m1);
      auto y = fetchVal(secondVal, m2);
      writeVal(thirdVal, m3, x == y ? 1 : 0);
      break;
    }
    case REL_BASE: {
      i += 2;
      relAddr += fetchVal(firstVal, m1);
      break;
    }
    }
  }
  return RunStatus{RunType::DONE};
}
