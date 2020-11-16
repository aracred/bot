const Discord = require('discord.js')
const dotenv = require('dotenv')
const Sentry = require('@sentry/node')
const detectHandler = require('./parser/detectHandler')
const {
  RequestHandlerError,
  WhitelistedChannelError,
} = require('./error-utils')
const { environment } = require('./environment')
const { error, log } = require('./utils')
const parseWhitelistedChannels = require('./parser/whitelistedChannels')
const roleMessage = require('./roleMessage')
const starboard = require('./starboard')

// Load this as early as possible, to init all the environment variables that may be needed
dotenv.config()
Sentry.init({ dsn: environment('SENTRY_DSN') })

const client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
})

client.on('ready', async () => {
  log(`Bot successfully started as ${client.user.tag}`)
  roleMessage(client)
})

client.on('messageReactionAdd', async (reaction, user) => {
  // When we receive a reaction we check if the reaction is partial or not
  if (reaction.partial) {
    // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
    try {
      await reaction.fetch()
    } catch (error) {
      console.error('Something went wrong when fetching the message: ', error)
      // Return as `reaction.message.author` may be undefined/null
      return
    }
  }
  let message = reaction.message
  let rMember = await message.guild.members.get(user.id)

  if (
    (message.author.id === user.id &&
      message.author.id !== '324631108731928587' &&
      message.author.id !== '235148962103951360') ||
    rMember.roles.cache.find(r => r !== 'Verified' || r !== 'Team')
  ) {
    // Remove the user's reaction
    reaction.users.remove(user.id)
    log(`Removed self reaction for ${user.tag}`)
  }
})

client.on('message', message => {
  const isCommand = message.content.split(' ')[0] === '!she'
  if (message.author.bot) {
    return
  }
  try {
    const whitelistedChannels = parseWhitelistedChannels()

    const messageWhitelisted = whitelistedChannels.reduce(
      (whitelisted, channel) =>
        channel === message.channel.name || channel === '*' || whitelisted,
      false,
    )

    if (!messageWhitelisted && whitelistedChannels) {
      return
    }

    if (message.channel.id === '772383977268969473') {
      starboard(message)
    }

    const handler = detectHandler(message.content)
    handler(message)
    log(
      `Served command ${message.content} successfully for ${message.author.username}`,
    )
  } catch (err) {
    if (err instanceof RequestHandlerError && isCommand) {
      message.reply(
        'Could not find the requested command. Please use !she help for more info.',
      )
    } else if (err instanceof WhitelistedChannelError) {
      error('FATAL: No whitelisted channels set in the environment variables.')
    }
    Sentry.captureException(err)
  }
})

client.login(process.env.DISCORD_API_TOKEN)
