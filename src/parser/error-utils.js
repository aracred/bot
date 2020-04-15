class RequestHandlerError extends Error {
  constructor(message) {
    super(`${Date.now()}: ${message}`)
    this.name = 'RequestHandlerError'
  }
}

class WhitelistedChannelError extends Error {
  constructor(message) {
    super(`${Date.now()}: ${message}`)
    this.name = 'WhitelistedChannelError'
  }
}

module.exports = { RequestHandlerError, WhitelistedChannelError }
