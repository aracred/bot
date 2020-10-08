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
const parseWhitelistedRoles = require('./parser/whitelistedRoles')

// Load this as early as possible, to init all the environment variables that may be needed
dotenv.config()
Sentry.init({ dsn: environment('SENTRY_DSN') })

const client = new Discord.Client()

client.on('ready', async () => {
  log(`Bot successfully started as ${client.user.tag}`)
})

client.on('message', message => {
  const isCommand = message.content.split(' ')[0] === '!she'
  if (message.author.bot) {
    return
  }
  try {
    const whitelistedChannels = parseWhitelistedChannels()
    const whitelistedRoles = parseWhitelistedRoles()

    const messageWhitelisted = whitelistedChannels.reduce(
      (whitelisted, channel) =>
        channel === message.channel.name || channel === '*' || whitelisted,
      false,
    )

    if (!messageWhitelisted && whitelistedChannels) {
      return
    }
    const roleWhitelisted = whitelistedRoles.reduce(
      (whitelisted, role) =>
        message.member.roles.cache.find(r => role === r.name) ||
        role === '*' ||
        whitelisted,
      false,
    )
    if (!roleWhitelisted && whitelistedRoles && isCommand) {
      message.reply('Your role level is not high enough to access this bot')
      return
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
