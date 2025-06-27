const { getClientPermissions } = require('../services/cache');
const logger = require('../utils/logger');
const db = require('../config/knex');

async function clientExists(clientId) {
  if (!clientId) return false;
  try {
    const exists = await db('client')
      .where('client_id', clientId)
      .first();
    return !!exists;
  } catch (err) {
    logger.error(`Error checking client ${clientId}: ${err.message}`);
    return false;
  }
}

async function getClientAllowedApis(businessid, useAllApis = false) {
  // Default to nominatim if no businessid or invalid client
  if (!businessid || !(await clientExists(businessid))) {
    logger.info(`Using default APIs for ${businessid || 'missing'} businessid`);
    return ['nominatim'];
  }

  try {
    // Try cache first
    const cached = await getClientPermissions(businessid);
    if (cached) {
      return useAllApis ? cached.all : cached.default;
    }

    // Fallback to database
    const rows = await db('client_api_permission as cap')
      .join('api_list as al', 'cap.api_permission', 'al.api_permission')
      .select('al.api_name', 'cap.is_default')
      .where('cap.client_id', businessid);

    return useAllApis
      ? [...new Set(rows.map(row => row.api_name))]
      : [...new Set(rows.filter(row => row.is_default).map(row => row.api_name))];
      
  } catch (err) {
    logger.error(`Error getting APIs for client ${businessid}: ${err.message}`);
    return ['nominatim']; // Fallback on error
  }
}

module.exports = { getClientAllowedApis };