const { RequestHandlerError } = require('./error-utils')
const handlers = require('../handlers/index')

const noop = () => undefined

module.exports = function detectHandler(message) {
  const requestedNamespace = message.split(' ')[0]
  let requestedHandler = message.split(' ')[1]
  // If it's not a flag, we can safely ignore this command.
  if (!requestedNamespace.includes('!')) {
    return noop()
  }
  let receivedHandler
  requestedNamespace === '!ac'
    ? (receivedHandler = handlers.get(requestedHandler))
    : () => {
      throw new RequestHandlerError(
        `Could not find command with namespace ${requestedNamespace}`,
      )
    }

  if (typeof receivedHandler !== 'function') {
    throw new RequestHandlerError(
      `Could not find command with flag ${requestedHandler}`,
    )
  }

  return receivedHandler
}
