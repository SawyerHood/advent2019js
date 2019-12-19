#include "intcode.hpp"
#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

int main() {
  std::string commands = "A,C,A,C,B,C,B,A,C,B\n"
                         "R,4,R,10,R,8,R,4\n"
                         "R,4,L,12,R,6,L,12\n"
                         "R,10,R,6,R,4\n"
                         "n\n";
  auto mach = Machine::fromFile("day17pt2.txt");
  std::vector<std::string> grid{std::string{}};

  auto result = mach.run();
  size_t i = 0;
  while (result.type != RunType::DONE) {
    if (result.type == RunType::OUTPUT) {
      std::cout << result.value << "\n";
    } else if (result.type == RunType::INPUT) {
      mach.input(commands[i]);
      i++;
    }
    result = mach.run();
  }

  return 0;
}
