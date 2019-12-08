const fs = require("fs");

function run() {
  const graph = createGraphFromFile("day6.txt");
  let total = 0;
  for (const node of graph.values()) {
    total += countOrbits(node);
  }
  console.log(total);
}

function countOrbits(node) {
  let count = -1;
  while (node != null) {
    node = node.parent;
    count++;
  }
  return count;
}

function createGraphFromFile(fileName) {
  const graph = new Map();
  for (const line of readLines(fileName)) {
    const [parentID, childID] = line.split(")");
    addConnection(graph, parentID, childID);
  }
  return graph;
}

function readLines(fileName) {
  return fs.readFileSync(fileName, "utf8").split("\n");
}

function addConnection(graph, parentID, childID) {
  const parent = graph.get(parentID) || createNode(parentID);
  const child = graph.get(childID) || createNode(childID);

  parent.children.push(child);
  child.parent = parent;
  graph.set(parentID, parent);
  graph.set(childID, child);
}

function createNode(id) {
  return {
    parent: null,
    children: [],
    id
  };
}

run();
