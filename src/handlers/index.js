const addAddressHandler = require('./addAddress')
const helpHandler = require('./help')
const tokenHandler = require('./token')
const scoreHandler = require('./score')
const introHandler = require('./intro')

const handlers = new Map([
  ['addaddress', addAddressHandler],
  ['help', helpHandler],
  ['token', tokenHandler],
  ['score', scoreHandler],
  ['intro', introHandler],
])

module.exports = handlers
