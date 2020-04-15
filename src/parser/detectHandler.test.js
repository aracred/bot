const detectHandler = require('./detectHandler')
const handlers = require('../handlers/index')

describe('detectHandler', () => {
  test('it should properly parse a command name', () => {
    expect(detectHandler('!signup')).toEqual(handlers.get('!signup'))
  })

  test('it should fail and return the help handler on empty strings', () => {
    expect(detectHandler('')).toBeNull()
  })

  test('it should fail on correct handlers supplied without the ! prefix', () => {
    expect(detectHandler('signup')).toBeNull()
  })
})
