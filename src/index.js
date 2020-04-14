const Discord = require('discord.js')
const dotenv = require('dotenv')
// Load this as early as possible, to init all the environment variables that may be needed
dotenv.config()

const detectHandler = require('./parser/detectHandler')
const handlers = require('./handlers/index')

const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Bot successfully started as ${client.user.tag}`)
})

client.on('message', message => {
  const requiredHandler = detectHandler(message.content)
  console.log(message.content)
  const handler = handlers.get(requiredHandler)
  if (typeof handler === 'function') {
    handler(message)
  }
})

client.login(process.env.DISCORD_API_TOKEN)
