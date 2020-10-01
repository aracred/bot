const { environment } = require('../environment')

module.exports = function parseWhitelistedRoles() {
  const roles = environment('WHITELISTED_ROLES')
  console.log('roles: ', roles)
  if (!roles) {
    return ['*']
  }

  return roles.split(',')
}