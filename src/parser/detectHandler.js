module.exports = function detectHandler(message) {
  if (!message) {
    return 'unknown'
  }
  return message.split(' ')[0]
}
