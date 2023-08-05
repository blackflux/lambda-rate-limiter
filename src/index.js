import LRU from 'lru-cache-ext';

export default (options) => {
  const tokenCache = new LRU({
    max: parseInt(options.uniqueTokenPerInterval || 500, 10),
    ttl: parseInt(options.interval || 60000, 10)
  });

  return {
    check: (limit, token) => new Promise((resolve, reject) => {
      const tokenCount = tokenCache.get(token) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount);
      }
      tokenCount[0] += 1;
      (tokenCount[0] <= parseInt(limit, 10) ? resolve : reject)(tokenCount[0]);
    })
  };
};
