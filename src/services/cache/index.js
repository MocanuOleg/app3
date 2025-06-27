const { initializePermissionCache, getClientPermissions } = require('./permissionCache');

initializePermissionCache();


setInterval(initializePermissionCache, 3600000);

module.exports = {
  getClientPermissions
};