module.exports = function parseMyCred(message) {
  if (typeof message !== 'string') {
    throw new Error(
      `Parsing command failed, reason: wrong type passed in. Expected string, got ${typeof message}`,
    )
  }

  if (message === '') {
    throw new Error(
      'Parsing command failed, reason: empty string provided as message',
    )
  }
  // Split xp message by whitespace,
  // and remove the two items (!xp @discordusername)
  const splitMessage = message.split(' ').slice(1)

  if (splitMessage.length < 1) {
    throw new Error(
      'Parsing command failed, reason: too few arguments were provided',
    )
  }
  if (splitMessage.length > 1) {
    throw new Error(
      'Parsing command failed, reason: too many arguments provided',
    )
  }
  return splitMessage[0]
}
