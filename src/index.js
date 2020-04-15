const Discord = require('discord.js')
const dotenv = require('dotenv')
// Load this as early as possible, to init all the environment variables that may be needed
dotenv.config()

const detectHandler = require('./parser/detectHandler')
const { log } = require('./utils')

const client = new Discord.Client()

client.on('ready', () => {
  log(`Bot successfully started as ${client.user.tag} 🦅`)
})

client.on('message', message => {
  if (message.author.bot) {
    return
  }

  const handler = detectHandler(message.content)

  if (typeof handler !== 'function') {
    log(`Could not recognize command: ${message.content}`)
    message.reply(
      'Command not recognized. Please check the parameters or use !help for more info.',
    )
    return
  }

  handler(message)
})

client.login(process.env.DISCORD_API_TOKEN)
