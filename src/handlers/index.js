// const addAddressHandler = require('./addAddress')
const helpHandler = require('./help')
const signupHandler = require('./signup')
// const xpHandler = require('./xp')

const handlers = new Map([
  // ['addaddress', addAddressHandler],
  ['help', helpHandler],
  ['signup', signupHandler],
  //['xp', xpHandler],
])

module.exports = handlers
