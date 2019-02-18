const LRU = require('lru-cache');

module.exports = (options) => {
  const tokenCache = new LRU({
    max: parseInt(options.uniqueTokenPerInterval === 0 ? 0 : options.uniqueTokenPerInterval || 500, 10),
    maxAge: parseInt(options.interval || 60000, 10)
  });

  return {
    check: (limit, token) => new Promise((resolve, reject) => {
      const tokenCount = tokenCache.get(token) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount);
      }
      tokenCount[0] += 1;
      return (tokenCount[0] <= parseInt(limit, 10) ? resolve : reject)(tokenCount[0]);
    })
  };
};
