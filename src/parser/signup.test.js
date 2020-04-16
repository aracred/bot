const parseSignup = require('./signup')

describe('signup parameters parser 📝', () => {
  test('It errors on empty strings', () =>
    expect(() => parseSignup('')).toThrow(/empty/))

  test('It throws if no arguments are provided', () =>
    expect(() => parseSignup('!ac signup')).toThrow(/arguments/))

  test('It throws if not enough arguments are provided', () =>
    expect(() => parseSignup('!ac signup foo')).toThrow(/enough/))

  test('It properly parses and returns the parameters for signup', () =>
    expect(parseSignup('!ac signup foo github/foo')).toEqual([
      'foo',
      ['github/foo'],
    ]))
})
