const addAddressHandler = require('./addAddress')
const helpHandler = require('./help')
const signupHandler = require('./signup')
const mycredHandler = require('./mycred')

const handlers = new Map([
  ['addaddress', addAddressHandler],
  ['help', helpHandler],
  ['signup', signupHandler],
  ['mycred', mycredHandler],
])

module.exports = handlers
