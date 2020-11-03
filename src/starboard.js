const fetch = require('node-fetch')
const Discord = require('discord.js')
const {
  decodeData,
  encodeData,
  marshallFileUpdate,
} = require('./handler-utils')
const { error, log } = require('./utils')

const GITHUB_API_URL = 'https://api.github.com'
const sendChannelId = '772343042199257098'

module.exports = async function starboard(message) {
  try {
    const yesterdayTimestamp = message.createdTimestamp - 86400000
    const name = message.author.username
    fetch(
      `${GITHUB_API_URL}/repos/ShenaniganDApp/scoreboard/contents/data/messageIds.json`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
        },
      },
    )
      .then(res => res.json())
      .then(async body => {
        const encodedContent = body.content
        const fileSha = body.sha
        log(`fetched file with sha ${fileSha} for user ${name}`)
        // Decode the content from the Github API response, as
        // it's returned as a base64 string.
        const decodedContent = decodeData(encodedContent) // Manipulated the decoded content:
        // First, check if the user already exists.decodedContent.unshift(message.id)
        for (let i = decodedContent.length - 1; i >= 0; i--) {
          let fetchedMessage = {}
          try {
            fetchedMessage = await message.channel.messages.fetch(
              decodedContent[i],
            )
          } catch (err) {
            log(err)
            decodedContent.splice(i, i)
            continue
          }
          const reactions = fetchedMessage.reactions
          let attachment = fetchedMessage.attachments
            ? fetchedMessage.attachments.size > 0
              ? fetchedMessage.attachments.map(a => a.attachment)
              : []
            : []
          if (reactions) {
            const starReactions = reactions.cache.get('⭐')
            const starCount = starReactions.count
            if (fetchedMessage.createdTimestamp > yesterdayTimestamp) {
              break
            } else {
              if (starCount < process.env.REACTION_LIMIT) {
                const sendChannel = message.guild.channels.cache.get(
                  sendChannelId,
                )
                await sendChannel
                  .send({
                    embed: new Discord.MessageEmbed().set

                      .setDescription(fetchedMessage)
                      .setTimestamp(fetchedMessage.createdTimestamp),
                    files: attachment,
                  })
                  .catch(err => log(err))
                log(`Sending message with id ${fetchedMessage.id}`)
                fetchedMessage.delete()
                decodedContent.splice(i, i)
              } else {
                decodedContent.splice(i, i)
              }
            }
          } else {
            decodedContent.splice(i, i)
          }
        }
        decodedContent.unshift(message.id)
        // We encode the updated content to base64.
        const updatedContent = encodeData(decodedContent)
        // We prepare the body to be sent to the API.
        const marshalledBody = marshallFileUpdate({
          message: 'Update messageIds.json',
          content: updatedContent,
          sha: fileSha,
        })
        // And we update the project.json file directly.
        fetch(
          `${GITHUB_API_URL}/repos/ShenaniganDApp/scoreboard/contents/data/messageIds.json`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
            },
            body: marshalledBody,
          },
        ).then(() => {
          log(
            `removed all messages before ${new Date(
              yesterdayTimestamp,
            ).toISOString()}`,
          )
        })
      })
      .catch(err => {
        error(err)
        message.reply(
          'Couldn\'t save the meme to the server. Wait and try again later',
        )
        message.delete()
      })
  } catch (err) {
    log(error)
  }
}
