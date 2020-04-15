const detectHandler = require('./detectHandler')

describe('detectHandler', () => {
  test('it should properly parse a command name', () => {
    expect(detectHandler('!signup')).toEqual('!signup')
  })
})
