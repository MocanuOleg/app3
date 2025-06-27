const Memcached = require('memcached');
const logger = require('../../utils/logger');
const config = require('../../config/cacheConfig');

const memcached = new Memcached(config.memcachedServer, {
  retries: config.retries,
  retry: config.retryTimeout,
  remove: config.removeFailedServer
});

// Event listeners for connection monitoring
memcached.on('failure', (err) => {
  logger.error(`Memcached connection error: ${err.message}`);
});

memcached.on('reconnecting', (details) => {
  logger.info(`Memcached reconnecting (attempt ${details.retries})`);
});

module.exports = memcached;