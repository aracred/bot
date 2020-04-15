const handlers = require('../handlers/index')
const { log } = require('../utils')

module.exports = function detectHandler(message) {
  const requestedHandler = message.split(' ').shift()
  const receivedHandler = handlers.get(requestedHandler)

  if (typeof receivedHandler !== 'function') {
    log(
      `Couldn't get ${requestedHandler}. This handler probably does not exist.`,
    )
    return null
  }

  return receivedHandler
}
