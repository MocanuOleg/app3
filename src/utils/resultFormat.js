function formatResultsArray(resultsArray, query) {
  const formatted = {};

  resultsArray.forEach((item, index) => {
    formatted[`Result ${index + 1} for query '${query}'`] = item;
  });

  return formatted;
}

module.exports = { formatResultsArray };