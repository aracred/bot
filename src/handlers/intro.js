module.exports = function token(message) {
  if (message.channel.name.toLowerCase() === '👋_-introductions-_👋') {
    const role = message.guild.roles.cache.find(r => r.name === 'Fans')
    message.author.add(role)
  }
}
