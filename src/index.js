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
  client.channels.cache
    .get('765653777691836428')
    .send(
      `React to this message to join active groups for your interests.\n
  💻: Developers\n
  🎨: Design\n
  🛒: Marketing\n
  You should see specific channels open to you once your inside Shenanigan`,
    )
    .then(sentEmbed => {
      sentEmbed.react('💻')
      sentEmbed.react('🎨')
      sentEmbed.react('🛒')
    })
})

// client.on('messageReactionAdd', (reaction, user) => {
//   if(message ===)
//   if (reaction === 💻){
// const role = member.guild.roles.cache.find(r => r.name === 'Developer')
// user.add(role)
//   } else if (reaction === 🎨){
// const role = member.guild.roles.cache.find(r => r.name === 'Designer')
// user.add(role)
//   } else if (reaction ===🦄){
// const role = member.guild.roles.cache.find(r => r.name === 'Social Media Unicorn')
// user.add(role)
//   }else
//   return null
// });

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
