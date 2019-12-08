const fs = require("fs");

function run(file) {
  const layers = readInput(file);
  const tables = layers.map(getFreqTable);
  let min = Number.MAX_SAFE_INTEGER;
  let mult = 0;
  for (const table of tables) {
    if ((table.get(0) || Number.MAX_SAFE_INTEGER) < min) {
      min = table.get(0);
      mult = table.get(1) * table.get(2);
    }
  }
  console.log(mult);
}

function getFreqTable(layer) {
  const table = new Map();

  for (const px of layer) {
    const freq = table.get(px) || 0;
    table.set(px, freq + 1);
  }
  return table;
}

function readInput(file) {
  const stream = fs
    .readFileSync(file, "utf8")
    .split("")
    .map(c => +c);
  const layerLen = 25 * 6;
  const layerCount = stream.length / layerLen;
  const layers = [];
  for (let i = 0; i < layerCount; i++) {
    const layer = [];
    for (let j = 0; j < layerLen; j++) {
      layer.push(stream[i * layerLen + j]);
    }
    layers.push(layer);
  }
  return layers;
}

run("day8.txt");
