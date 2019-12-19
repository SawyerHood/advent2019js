#include <iostream>

#include "intcode.hpp";

int main() {

  Machine mach = Machine::fromFile("day9.txt");

  auto result = mach.run();
  while (result.type != RunType::DONE) {
    if (result.type == RunType::INPUT) {
      mach.input(1);
    } else if (result.type == RunType::OUTPUT) {
      std::cout << result.value << "\n";
    }
    result = mach.run();
  }
  std::cout << "Finished \n";
  return 0;
}