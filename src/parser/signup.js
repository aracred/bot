module.exports = function parseSignup(message, discordId) {
  if (typeof message !== 'string') {
    throw new Error(
      `Parsing command failed, reason: wrong type passed in. Expected string, got ${typeof message}`,
    )
  }

  if (message === '') {
    throw new Error(
      'Parsing command failed: reason: empty string provided as message',
    )
  }
  // Split the signup message by whitespace,
  // and remove the first two items (!ac signup flag)
  const splitMessage = message.split(' ').slice(2)
  if (splitMessage.length === 0) {
    throw new Error(
      'Parsing command failed, reason: no arguments were provided',
    )
  }

  if (splitMessage.length < 2) {
    throw new Error(
      'Parsing command failed, reason: not enough arguments. Expecting a minimum of two: the username and a platform alias.',
    )
  }

  const [username, ...unparsedPlatforms] = splitMessage
  if (username.includes('/')) {
    throw new Error('Parsing command failed, reason: username not provided.')
  }
  // As we're expecting the format to be of the type
  // PLATFORM/IDENTIFIER, we now parse each string, splitting
  // by the / separator, lowercase the platform, and re-joining strings
  const parsedPlatforms = unparsedPlatforms
    .map(platformWithId => {
      const [platformName, identifier] = platformWithId.split('/')
      const lowercasedPlatformName = platformName.trim().toLowerCase()
      const sanitizedIdentifier = identifier.trim()
      return `${lowercasedPlatformName}/${sanitizedIdentifier}`
    })
    .filter(platform => !platform.includes('discord'))

  parsedPlatforms.push(`discord/${discordId}`)

  return [username, parsedPlatforms]
}
