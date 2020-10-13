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

// Load this as early as possible, to init all the environment variables that may be needed
dotenv.config()
Sentry.init({ dsn: environment('SENTRY_DSN') })

const client = new Discord.Client()

client.on('ready', async () => {
  log(`Bot successfully started as ${client.user.tag}`)
  const filter = (reaction) => {
    return (
      reaction.emoji.name === '💻' ||
      reaction.emoji.name === '🎨' ||
      reaction.emoji.name === '🛒'
    )
  }
  const message = await client.channels.cache
    .get('765653777691836428')
    .messages.fetch('765662524900769872')
  const collector = message.createReactionCollector(filter)
  collector.on('collect', (reaction, user) => {
    const member = message.guild.members.cache.get(user.id)
    if (reaction.emoji.name === '💻') {
      const role = message.guild.roles.cache.find(r => r.name === 'Developer')
      member.roles.add(role)
    } else if (reaction.emoji.name === '🎨') {
      const role = message.guild.roles.cache.find(r => r.name === 'Designer')
      member.roles.add(role)
    } else if (reaction.emoji.name === '🛒') {
      const role = message.guild.roles.cache.find(
        r => r.name === 'Social Media Unicorn',
      )
      member.roles.add(role)
    } else return null
  })
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
