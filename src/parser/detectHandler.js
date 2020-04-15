const { RequestHandlerError } = require('./error-utils')
const handlers = require('../handlers/index')

const noop = () => undefined

module.exports = function detectHandler(message) {
  const requestedHandler = message.split(' ').shift()
  // If it's not a flag, we can safely ignore this command.
  if (!requestedHandler.includes('!')) {
    return noop()
  }

  const receivedHandler = handlers.get(requestedHandler)

  if (typeof receivedHandler !== 'function') {
    throw new RequestHandlerError(
      `Could not find command with flag ${requestedHandler}`,
    )
  }

  return receivedHandler
}
