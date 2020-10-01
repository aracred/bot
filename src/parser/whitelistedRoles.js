module.exports = function parseWhitelistedRoles() {
  const roles = process.env.WHITELISTED_ROLES
  if (!roles) {
    return ['*']
  }

  return roles.split(',')
}
