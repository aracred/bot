const { environment } = require('../environment')

module.exports = function parseWhitelistedRoles() {
  const roles = environment('WHITELISTED_ROLES')
  if (!roles) {
    return ['*']
  }

  return roles.split(',')
}
