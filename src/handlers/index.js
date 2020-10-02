const addAddressHandler = require('./addAddress')
const helpHandler = require('./help')
const tokenHandler = require('./token')

const handlers = new Map([
  ['addaddress', addAddressHandler],
  ['help', helpHandler],
  ['token', tokenHandler]
])

module.exports = handlers
