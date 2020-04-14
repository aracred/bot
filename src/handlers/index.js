const addAddressHandler = require('./addAddress')
const signupHandler = require('./signup')

const handlers = new Map([
  ['!addaddress', addAddressHandler],
  ['!signup', signupHandler],
])

module.exports = handlers
