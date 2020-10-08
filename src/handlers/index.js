const addAddressHandler = require('./addAddress')
const helpHandler = require('./help')
const tokenHandler = require('./token')
const scoreHandler = require('./score')

const handlers = new Map([
  ['addaddress', addAddressHandler],
  ['help', helpHandler],
  ['token', tokenHandler],
  ['score', scoreHandler]
])

module.exports = handlers
