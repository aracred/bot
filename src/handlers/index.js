const addAddressHandler = require('./addAddress')
const helpHandler = require('./help')

const handlers = new Map([
  ['addaddress', addAddressHandler],
  ['help', helpHandler],
])

module.exports = handlers
