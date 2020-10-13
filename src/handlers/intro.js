module.exports = function intro(message) {
  const role = message.guild.roles.cache.find(r => r.name === 'Fans')
  const member = message.guild.members.cache.get(message.author.id)
  member.roles.add(role)
}
