const { environment } = require('../environment')

module.exports = function parseWhitelistedChannels() {
  const channels = environment('WHITELISTED_CHANNELS')
  if (!channels) {
    throw new Error(
      `Channel parsing failed, reason: expected type string, got ${typeof channels}`,
    )
  }

  return channels.split(',')
}
