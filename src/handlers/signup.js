const fetch = require('node-fetch')
const { environment } = require('../environment')
const {
  decodeData,
  encodeData,
  marshallFileUpdate,
  marshallUser,
} = require('../handler-utils')
const parseSignup = require('../parser/signup')
const { error, log } = require('../utils')

const GITHUB_API_URL = 'https://api.github.com'

module.exports = function signup(message) {
  try {
    const [username, platforms] = parseSignup(
      message.content,
      message.member.id,
    )

    fetch(`${GITHUB_API_URL}/repos/${environment('GITHUB_FILE_PATH')}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${environment('GITHUB_API_TOKEN')}`,
      },
    })
      .then(res => res.json())
      .then(body => {
        const encodedContent = body.content
        const fileSha = body.sha
        log(
          `fetched file with sha ${fileSha} for user ${message.author.username}`,
        )
        // Decode the content from the Github API response, as
        // it's returned as a base64 string.
        const decodedContent = decodeData(encodedContent) // Manipulated the decoded content:
        // First, check if the user already exists.
        // If it does, stop the process inmediately.
        const userExists = decodedContent[1].identities.find(
          identity =>
            identity.username.toLowerCase() === username.toLowerCase(),
        )

        if (userExists) {
          message.reply('You have already registered.')
          log(
            `Detected ${message.author.username} already exists with username ${username}`,
          )
          return
        }
        // If the user is not registered, we can now proceed to mutate
        // the file by appending the user to the end of the array.
        const userIdentity = marshallUser({ username, platforms })
        decodedContent[1].identities.push(userIdentity)
        // We encode the updated content to base64.
        const updatedContent = encodeData(decodedContent)
        // We prepare the body to be sent to the API.
        const marshalledBody = marshallFileUpdate({
          message: 'Update project.json',
          content: updatedContent,
          sha: fileSha,
        })
        // And we update the project.json file directly.
        fetch(`${GITHUB_API_URL}/repos/${environment('GITHUB_FILE_PATH')}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${environment('GITHUB_API_TOKEN')}`,
          },
          body: marshalledBody,
        }).then(() => {
          log('Updated file on GitHub successfully.')
          message.reply('Update was successful!')
        })
      })
      .catch(err => {
        error(err)
        message.reply(
          'Something went wrong while executing the command. Please try again in a few minutes.',
        )
      })
  } catch (err) {
    log(err)
    message.reply(
      'Command parsing failed. Please use the !ac help command to see how to use the requested command properly.',
    )
  }
}
