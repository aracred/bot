const { environment } = require('../environment')
const { WhitelistedChannelError } = require('./error-utils')

module.exports = function parseWhitelistedChannels() {
  const channels = environment('WHITELISTED_CHANNELS')
  if (!channels) {
    throw new WhitelistedChannelError(
      `Channel environment variable parsing failed, reason: expected type string, got ${typeof channels}. You probably didn't configure the environment variable correctly.`,
    )
  }

  return channels.split(',')
}
