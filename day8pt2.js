const fs = require("fs");

function run(file) {
  const layers = readInput(file);
  const res = [];
  for (let i = 0; i < 6; i++) {
    const row = [];
    for (let j = 0; j < 25; j++) {
      for (const layer of layers) {
        if (layer[i * 25 + j] !== 2) {
          row.push(layer[i * 25 + j] === 0 ? " " : "1");
          break;
        }
      }
    }
    res.push(row);
    console.log(row.join(""));
  }
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
