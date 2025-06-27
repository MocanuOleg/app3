const db = require('../../config/knex');
const memcached = require('./cacheClient');
const logger = require('../../utils/logger');
const config = require('../../config/cacheConfig');

const CACHE_PREFIX = 'client_perms:';

async function initializePermissionCache() {
  try {
    const clientIds = await db('client').pluck('client_id');
    await Promise.all(clientIds.map(cacheClientPermissions));
    logger.info(`Initialized permission cache for ${clientIds.length} clients`);
  } catch (err) {
    logger.error(`Permission cache initialization failed: ${err.message}`);
  }
}

async function cacheClientPermissions(clientId) {
  try {
    const permissions = await db('client_api_permission as cap')
      .join('api_list as al', 'cap.api_permission', 'al.api_permission')
      .select('al.api_name', 'cap.is_default')
      .where('cap.client_id', clientId);

    const cacheData = {
      all: [...new Set(permissions.map(p => p.api_name))],
      default: [...new Set(permissions.filter(p => p.is_default).map(p => p.api_name))]
    };

    await new Promise((resolve, reject) => {
      memcached.set(
        `${CACHE_PREFIX}${clientId}`, 
        JSON.stringify(cacheData), 
        config.permissionCacheTTL, 
        (err) => err ? reject(err) : resolve()
      );
    });
  } catch (err) {
    logger.error(`Failed to cache permissions for client ${clientId}: ${err.message}`);
    throw err;
  }
}

async function getClientPermissions(clientId) {
  return new Promise((resolve) => {
    memcached.get(`${CACHE_PREFIX}${clientId}`, (err, data) => {
      if (err) {
        logger.error(`Cache read error for client ${clientId}: ${err.message}`);
        resolve(null);
      } else {
        resolve(data ? JSON.parse(data) : null);
      }
    });
  });
}

module.exports = {
  initializePermissionCache,
  cacheClientPermissions,
  getClientPermissions
};