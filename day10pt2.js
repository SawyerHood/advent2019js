const fs = require("fs");

function run(file) {
  const input = readInput(file);

  const info = getInfo(input, 25, 22);
  //   const info = getInfo(input, 13, 11);
  info.forEach(i => console.log(i.coords, i.slope, i.dist));
  let delCount = 0;
  let seen = new Set();

  while (seen.size !== info.length) {
    let lastVal;
    for (let i = 0; i < info.length; i++) {
      if (seen.has(i)) {
        continue;
      }
      if (info[i].slope === lastVal) {
        continue;
      }
      delCount++;
      seen.add(i);
      lastVal = info[i].slope;

      if (delCount === 200) {
        const [x, y] = info[i].coords;
        console.log([x, y]);
        return;
      }
    }
  }
}

function getInfo(input, x, y) {
  const info = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (x === i && y === j) {
        continue;
      }
      if (input[i][j] === "#") {
        let slope = (Math.atan2(j - y, i - x) * 180) / Math.PI + 180;
        const dist = Math.sqrt((j - y) * (j - y) + (i - x) * (i - x));
        info.push({ slope, dist, coords: [i, j] });
      }
    }
  }

  info.sort((a, b) => {
    if (a.slope < b.slope) {
      return 1;
    }
    if (a.slope > b.slope) {
      return -1;
    }

    if (a.dist < b.dist) {
      return -1;
    }

    return 1;
  });

  return info;
}

function readInput(fileName) {
  const str = fs.readFileSync(fileName, "utf8");
  return str.split("\n").map(line => line.split(""));
}

run("day10.txt");
