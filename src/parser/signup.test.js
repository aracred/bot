const parseSignup = require('./signup')

const discordId = '474405294307278880'

describe('signup parameters parser 📝', () => {
  test('It errors on empty strings', () =>
    expect(() => parseSignup('', discordId)).toThrow(/empty/))

  test('It throws if no arguments are provided', () =>
    expect(() => parseSignup('!ac signup', discordId)).toThrow(/arguments/))

  test('It throws if not enough arguments are provided', () =>
    expect(() => parseSignup('!ac signup foo', discordId)).toThrow(/enough/))
  
  test('It throws if it receives undefined as discordId', () =>
    expect(() => parseSignup('!ac signup foo', undefined)).toThrow(/gathered/))

  test('It properly parses and returns the parameters for signup', () =>
    expect(parseSignup('!ac signup foo github/foo', discordId)).toEqual([
      'foo',
      ['github/foo', `discord/${discordId}`],
    ]))
})
