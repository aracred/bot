module.exports = function parseAddAddress(message) {
  if (typeof message !== 'string') {
    throw new Error(
      `Parsing command failed, reason: wrong type passed in. Expected string, got ${typeof message}`,
    )
  }
  // Split the signup message by whitespace,
  // and remove the first item (!signup flag)
  const splitMessage = message.split(' ').slice(1)
  if (splitMessage.length === 0) {
    throw new Error(
      'Parsing command failed, reason: no arguments were provided',
    )
  }

  const [username, address] = splitMessage

  return [username, address]
}
