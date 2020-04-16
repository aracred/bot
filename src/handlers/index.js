const addAddressHandler = require('./addAddress')
const helpHandler = require('./help')
const signupHandler = require('./signup')

// This is the handler for commands with !ac flag.
const handlers = new Map([
  ['addaddress', addAddressHandler],
  ['help', helpHandler],
  ['signup', signupHandler],
])

module.exports = handlers
