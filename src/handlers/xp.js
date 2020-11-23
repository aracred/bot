const fetch = require('node-fetch')
const {environment} = require('../environment')
const {
  decodeData,
} = require('../handler-utils')
const {error, log} = require('../utils')
const parseMyCred = require('../parser/myCred')

const GITHUB_API_URL = 'https://api.github.com'

const getScores = (message, targetParameter, authorUsername, authorDiscordID, identities, oid) => {
  log(`getScores ${targetParameter} - ${environment('GITHUB_SCORES_FILE_PATH')}/oid`)
  fetch(
    `https://api.github.com/repos/${environment('GITHUB_SCORES_FILE_PATH')}/${oid}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${environment('GITHUB_API_TOKEN')}`,
      },
    }
  )
    .then(res => res.json())
    .then(body => {
      const encodedContent = body.content
      const fileSha = body.sha
      log(
        `fetched file with ${fileSha} for user ${authorUsername}`
      )
      log(identities)
      // Decode the content from the Github API response, as
      // it's returned as a base64 string.
      const decodedContent = decodeData(encodedContent) // Manipulated the decoded content:
      // First, check if the user already exists.
      // If it does, stop the process immediately.
      const obj = decodedContent[1]
      const scores = obj.users
      const user = scores.find(
        identity => {
          const membershipProvider = identity.address[1]
          const membershipID = identity.address.slice(-1)[0]
          if (identities.username.toLowerCase() === membershipID.toLowerCase()) {
            return identity
          }
          const memberExists = identities.aliases.findIndex(
            a =>
              a.platformName !== null && a.id !== null &&
                            a.platformName.toLowerCase() === membershipProvider &&
                            a.id.toLowerCase() === membershipID.toLowerCase()
          )
          if (memberExists > -1) {
            return identity
          }
          return false
        }
      )
      if (user === false || user === undefined || user === null) {
        message.reply(
          'Something went wrong while executing the command. Please try again in a few minutes.',
        )
        return
      }
      let myTotalCred = user.totalCred
      var lengthArray = user.intervalCred.length
      let myWeeklyCred = user.intervalCred
      var variationManual =
                (100 * (myWeeklyCred[lengthArray - 1] - myWeeklyCred[lengthArray - 2])) /
                myWeeklyCred[lengthArray - 2]
      const Discord = require('discord.js')
      let embed = new Discord.MessageEmbed()
        .setColor('#ff3864')
        .setDescription(`Hello ${authorUsername}, this is the cred requested for ${targetParameter}!`) //```\
        .setThumbnail(
          'https://raw.githubusercontent.com/sourcecred/sourcecred/master/src/assets/logo/rasterized/logo_64.png'
        )
        .addFields(
          {
            name: 'Total',
            value: Math.round(myTotalCred) + ' Cred',
            inline: true,
          },
          {
            name: 'Last week ',
            value: myWeeklyCred[lengthArray - 1].toPrecision(3) + ' Cred',
            inline: true,
          },
          {
            name: 'Week before',
            value: myWeeklyCred[lengthArray - 2].toPrecision(4) + ' Cred',
            inline: true,
          },
          {
            name: 'Weekly Change',
            value: variationManual.toPrecision(2) + '%',
          }
        )
      message.reply(embed)
    })
    .catch(err => {
      error(err)
      message.reply(
        `Cred for user ${targetParameter} not found.`
      )
    })
}

const getScoresBlobSha = (message, targetParameter, authorUsername, authorDiscordID, identities) => {
  log(`getScoresBlobSha ${targetParameter} - ${environment('GITHUB_API_URL')}/graphql`)
  const query = `
    {
        repository(owner: "Metafam", name: "TheSource") {
            object(expression: "master:scores.json") {
                ... on Blob {
                    oid
                }
            }
        }
    }
    `
  fetch(
    'https://api.github.com/graphql',
    {
      method: 'POST',
      Accept: 'api_version=2',
      'Content-Type': 'application/graphql',
      headers: {
        Authorization: `Bearer ${environment('GITHUB_API_TOKEN')}`,
      },
      body: JSON.stringify({query})
    }
  )
    .then(res => res.json())
    .then(response => {
      const oid = response.data.repository.object.oid
      if (oid === null || oid === undefined || oid.length === 0) {
        throw new Error('oid undefined')
      }
      return getScores(message, targetParameter, authorUsername, authorDiscordID, identities, oid)
    })
    .catch(err => {
      error(err)
      message.reply(
        `Something went wrong while executing the command: ${err.toString()}`
      )
    })
}

const getIdentities = (message, targetParameter, authorUsername, authorDiscordID) => {
  log(`getIdentities ${targetParameter} - ${environment('GITHUB_API_TOKEN')} - ${GITHUB_API_URL}/repos/${environment('GITHUB_FILE_PATH')}`)
  fetch(`https://api.github.com/repos/${environment('GITHUB_FILE_PATH')}`, {
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
        `fetched file with sha ${fileSha} for user ${authorUsername}`,
      )
      // Decode the content from the Github API response, as
      // it's returned as a base64 string.
      const decodedContent = decodeData(encodedContent) // Manipulated the decoded content:
      const identities = decodedContent[1].identities

      let existingIdentityIndex
      // First, check if the identity already exists in the username database
      existingIdentityIndex = identities.findIndex(
        identity => identity.username.toLowerCase() === targetParameter.toLowerCase()
      )
      if (existingIdentityIndex === -1) {
        if (targetParameter.startsWith('<@!')) {
          const id = targetParameter.slice(3, targetParameter.length - 1)
          log('fetch ' + id)
          existingIdentityIndex = identities.findIndex(
            identity =>
              identity.aliases.includes(`discord/${id}`),
          )
        } else {
          existingIdentityIndex = identities.findIndex(
            identity =>
              identity.aliases.includes(`${targetParameter}`)
          )
        }
      }

      if (existingIdentityIndex !== -1) {
        // Add new identities to existing user
        const existingIdentity = identities[existingIdentityIndex]
        const existingPlatforms = existingIdentity.aliases.map(p => {
          const [platformName, identifier] = p.split('/')
          return {platformName, id: identifier}
        })
        const platforms = {username: existingIdentity.username, aliases: existingPlatforms}
        return getScoresBlobSha(message, targetParameter, authorUsername, authorDiscordID, platforms)
      } else {
        message.reply(
          'User not found, please signup with `!ac signup platform/username`',
        )
        return
      }
    })
    .catch(err => {
      error(err)
      message.reply(
        `Failed to fetch cred for user ${targetParameter}`,
      )
    })
}

module.exports = function myCred(message) {
  try {
    const targetParameter = parseMyCred(message.content)
    const authorUsername = message.author.username
    const authorDiscordID = message.author.id

    log(`myCred : ${targetParameter} ${authorUsername} ${authorDiscordID}`)

    return getIdentities(message, targetParameter, authorUsername, authorDiscordID)
  } catch (err) {
    return message.channel.send(
      'Hey, make sure to write this : !ac xp *[your github name]* If unsuccessful, try then with your discord or discourse name'
    )
  }
}
