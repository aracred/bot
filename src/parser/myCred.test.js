const parseMyCred = require('./myCred')

describe('mycred handler tests', () => {
  test('It should error if a string is not provided', () =>
    expect(() => parseMyCred(undefined)).toThrow(/type/))

  test('It should error if an empty string is passed in', () =>
    expect(() => parseMyCred('')).toThrow(/empty/))

  test('It should error if not enough arguments are provided', () =>
    expect(() => parseMyCred ('!xp')).toThrow(/arguments/))

  test('It should properly pass a well formed message', () =>
    expect(
      parseMyCred(
        '!xp myname(discord)',
      ),
    ).toEqual('myname(discord)'))
})
