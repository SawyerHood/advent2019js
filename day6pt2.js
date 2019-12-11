const fs = require("fs");

function run() {
  const graph = createGraphFromFile("day6.txt");
  const sanRents = getParents(graph.get("SAN"));
  const youRents = getParents(graph.get("YOU"));
  for (let i = 0; i < sanRents.length; i++) {
    const node = sanRents[i];
    const youIdx = youRents.indexOf(node);
    if (youIdx > -1) {
      console.log(i + youIdx);
      return;
    }
  }
}

function getParents(node) {
  const parents = [];
  while (node != null) {
    parents.push(node.parent);
    node = node.parent;
  }
  return parents;
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
