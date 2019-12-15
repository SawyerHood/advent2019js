const fs = require("fs");

function main() {
  const tree = readInput("day14.txt");
  const fuel = search(tree, 1000000000000, 1, 1000000000000);
  console.log(fuel);
}

function search(tree, target, start, end) {
  if (start > end) {
    return -1;
  }

  const mid = Math.floor((start + end) / 2);
  const res = solve(tree, mid);
  console.log(mid);
  if (res === target) {
    return mid;
  }
  if (res > target) {
    return search(tree, target, start, mid - 1);
  }

  return search(tree, target, mid + 1, end);
}

function solve(tree, fuelCount) {
  const queue = tree
    .get("FUEL")
    .inputs.map(({ comp, count }) => ({ comp, count: count * fuelCount }));
  let ore = 0;
  const leftover = new Map();
  while (queue.length) {
    const { comp, count } = queue.shift();
    if (comp === "ORE") {
      ore += count;
      continue;
    }
    const leftoverCount = leftover.get(comp) || 0;
    const formula = tree.get(comp);
    const newCount = count - leftoverCount;
    if (newCount <= 0) {
      leftover.set(comp, leftoverCount - count);
      continue;
    }
    const mult = Math.ceil(newCount / formula.output.count);
    leftover.set(comp, mult * formula.output.count - newCount);
    const newInputs = formula.inputs.map(i => ({
      comp: i.comp,
      count: mult * i.count
    }));
    queue.push(...newInputs);
  }
  return ore;
}

function readInput(fileName) {
  const str = fs.readFileSync(fileName, "utf8");
  const pairs = str.split("\n").map(parseLine);

  const tree = new Map();
  for (const pair of pairs) {
    const { output } = pair;
    tree.set(output.comp, pair);
  }
  return tree;
}

function parseLine(line) {
  let [inputs, output] = line.split("=>");
  inputs = inputs.split(",").map(parseCompound);
  output = parseCompound(output);
  return { inputs, output };
}

function parseCompound(c) {
  const res = c.trim().split(" ");
  return { count: +res[0], comp: res[1] };
}

main();
