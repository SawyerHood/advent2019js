#include "intcode.hpp"
#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

struct Step {
  char move = 'R';
  int steps = 0;
};

struct Coord {
  int x = 0;
  int y = 0;
};

char nextDir(char dir, int turn) {
  std::vector<char> dirs{'N', 'E', 'S', 'W'};

  int index = 0;
  for (int i = 0; i < dirs.size(); i++) {
    if (dirs[i] == dir) {
      index = i;
    }
  }

  int newIndex = index + turn;

  if (newIndex >= dirs.size()) {
    newIndex = 0;

  } else if (newIndex < 0) {
    newIndex = dirs.size() - 1;
  }
  return dirs[newIndex];
}

Coord nextPos(Coord pos, char dir) {
  switch (dir) {
  case 'S':
    return Coord{pos.x, pos.y + 1};
  case 'E':
    return Coord{pos.x + 1, pos.y};
  case 'N':
    return Coord{pos.x, pos.y - 1};
  case 'W':
    return Coord{pos.x - 1, pos.y};
  }
  throw "Invalid Dir for nextPos";
}

bool isValidPos(std::vector<std::string> grid, Coord pos) {
  if (pos.y >= grid.size() || pos.y < 0 || pos.x >= grid[pos.y].size() ||
      pos.x < 0) {
    return false;
  }
  return grid[pos.y][pos.x] == '#';
}

int main() {
  auto mach = Machine::fromFile("day17.txt");
  std::vector<std::string> grid{std::string{}};

  auto result = mach.run();
  while (result.type != RunType::DONE) {
    if (result.type != RunType::OUTPUT) {
      std::cout << "Error";
    }

    switch (result.value) {
    case 10: {
      grid.push_back(std::string{});
      break;
    }
    default: {
      grid.back().push_back(result.value);
      break;
    }
    }
    result = mach.run();
  }

  // Remove empty row at the end
  grid.pop_back();

  for (auto &s : grid) {
    std::cout << s << "\n";
  }

  auto total = 0;

  for (auto i = 1; i < grid.size() - 1; i++) {
    for (auto j = 1; j < grid[i].size() - 1; j++) {
      std::vector<char> chars{grid[i][j], grid[i][j + 1], grid[i][j - 1],
                              grid[i + 1][j], grid[i - 1][j]};

      auto allBlock = std::all_of(chars.begin(), chars.end(),
                                  [](char c) { return c == '#'; });
      if (allBlock) {
        total += i * j;
      }
    }
  }

  std::cout << "Part 1: " << total << "\n";

  auto dir = 'E';
  Coord pos{6, 0};
  std::vector<Step> steps{Step{}};
  std::vector<int> options{0, 1, -1};
  while (true) {
    auto didMove = false;
    for (int option : options) {
      auto newDir = nextDir(dir, option);
      auto newPos = nextPos(pos, newDir);
      if (isValidPos(grid, newPos)) {
        std::cout << newDir << "\n";
        dir = newDir;
        pos = newPos;
        if (option == 0) {
          steps.back().steps += 1;
        } else {
          steps.push_back(Step{option == 1 ? 'R' : 'L', 1});
        }
        didMove = true;
        break;
      }
    }

    if (!didMove) {
      break;
    }
  }

  for (Step &step : steps) {
    std::cout << step.move << "," << step.steps << ",";
  }

  std::cout << "\n";

  return 0;
}
