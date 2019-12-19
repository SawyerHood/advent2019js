#include <string>
#include <vector>

struct Inst {
  long long op;
  long long m1;
  long long m2;
  long long m3;
};

enum class RunType {
  INPUT,
  OUTPUT,
  DONE,
};

struct RunStatus {
  RunType type;
  long long value = 0;
};

class Machine {
  std::vector<long long> state;
  int i = 0;
  int inputVal = 0;
  int inputMode = 0;
  int relAddr = 0;

public:
  Machine(std::vector<long long> state);
  static Machine fromFile(std::string fileName);
  long long fetchVal(int value, int mode);
  void writeVal(int val, int mode, long long toPut);
  void input(long long in);
  RunStatus run();
};