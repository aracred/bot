module.exports = async function roleMessage(client) {
  const filter = reaction => {
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
}
