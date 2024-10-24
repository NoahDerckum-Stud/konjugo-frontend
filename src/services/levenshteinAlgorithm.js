function compareStrings(expected, actual) {
  const expectedLen = expected.length;
  const actualLen = actual.length;

  const matrix = Array(expectedLen + 1)
    .fill(null)
    .map(() => Array(actualLen + 1).fill(null));

  for (let i = 0; i <= expectedLen; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= actualLen; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= expectedLen; i++) {
    for (let j = 1; j <= actualLen; j++) {
      const cost = expected[i - 1] === actual[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  let i = expectedLen;
  let j = actualLen;
  const diffs = [];

  while (i > 0 || j > 0) {
    if (i > 0 && matrix[i][j] === matrix[i - 1][j] + 1) {
      diffs.push({ type: "deletion", char: expected[i - 1], index: i - 1 });
      i--;
    } else if (j > 0 && matrix[i][j] === matrix[i][j - 1] + 1) {
      diffs.push({ type: "insertion", char: actual[j - 1], index: j - 1 });
      j--;
    } else {
      if (matrix[i][j] !== matrix[i - 1][j - 1]) {
        diffs.push({
          type: "substitution",
          expectedChar: expected[i - 1],
          actualChar: actual[j - 1],
          index: i - 1,
        });
      }
      i--;
      j--;
    }
  }

  return diffs.reverse();
}

function generateDiffArray(expected, actual) {
  const diffs = compareStrings(expected, actual);
  let result = [];
  let expectedIndex = 0;
  let actualIndex = 0;

  diffs.forEach((diff) => {
    while (expectedIndex < diff.index && actualIndex < diff.index) {
      result.push({ char: expected[expectedIndex], role: "normal" });
      expectedIndex++;
      actualIndex++;
    }

    if (diff.type === "deletion") {
      result.push({ char: diff.char, role: "deletion" });
      expectedIndex++;
    } else if (diff.type === "insertion") {
      result.push({ char: diff.char, role: "insertion" });
      actualIndex++;
    } else if (diff.type === "substitution") {
      result.push({ char: diff.expectedChar, role: "substitution" });
      expectedIndex++;
      actualIndex++;
    }
  });

  return result;
}

Array.prototype.insert = function (index, ...items) {
  this.splice(index, 0, ...items);
};

function bakedComparision(expected, actual) {
  let comparison = compareStrings(expected, actual);

  let result = [];

  for (let i = 0; i < expected.length; i++) {
    result.push({ char: expected[i], type: "normal" });
  }

  for (let i = 0; i < comparison.length; i++) {
    if (
      comparison[i].type == "substitution" ||
      comparison[i].type == "deletion"
    )
      result[comparison[i].index].type = comparison[i].type;
  }

  for (let i = 0; i < comparison.length; i++) {
    if (comparison[i].type == "insertion")
      result.insert(comparison[i].index, {
        char: comparison[i].char,
        type: "insertion",
      });
  }

  let levenshteinDistance = 0;

  for (let i = 0; i < result.length; i++) {
    if (result[i].type == "insertion" || result[i].type == "deletion") {
      levenshteinDistance++;
    }
    if (result[i].type == "substitution") {
      levenshteinDistance += 0.5;
    }
  }

  return { result, levenshteinDistance };
}

function getResultCharClass(role) {
  switch (role) {
    case "normal":
      return "";
    case "insertion":
      return "text-secondary text-decoration-line-through";
    case "deletion":
      return "text-danger";
    case "substitution":
      return "text-primary";
  }
  return "";
}

export {
  compareStrings,
  generateDiffArray,
  bakedComparision,
  getResultCharClass,
};
