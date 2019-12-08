const START = 347312;
const END = 805915;

function run() {
  let validCount = 0;
  for (let i = START; i < END; i++) {
    if (isValid(i)) {
      validCount++;
    }
  }
  console.log(validCount);
}

function isValid(num) {
  const str = String(num);
  const getDigit = idx => (idx >= 0 && idx < str.length ? +str[idx] : -1);
  let seenDouble = 0;
  let doubleCount = 0;
  for (let i = 0; i < str.length; i++) {
    const currentDigit = getDigit(i);
    const prevDigit = getDigit(i - 1);
    const nextDigit = getDigit(i + 1);

    if (currentDigit === prevDigit) {
      doubleCount++;
      if (doubleCount === 1) {
        seenDouble++;
      } else if (doubleCount === 2) {
        seenDouble--;
      }
    } else {
      doubleCount = 0;
    }

    if (prevDigit > currentDigit) {
      return false;
    }
  }

  return seenDouble > 0;
}

run();
