const signupHandler = require('./signup')

const handlers = new Map([['!signup', signupHandler]])

module.exports = handlers
