module.exports = {
  memcachedServer: process.env.MEMCACHED_SERVER || 'localhost:11211',
  permissionCacheTTL: process.env.PERMISSION_CACHE_TTL || 3600, 
  retries: 3,
  retryTimeout: 1000,
  removeFailedServer: true
};