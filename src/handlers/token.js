const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = function token(message) {
  const query = `{
    token(id:"0xb5d592f85ab2d955c25720ebe6ff8d4d1e1be300") {
        id
      totalLiquidity
      name
      symbol
      tradeVolumeUSD
    }
  }`

  fetch('https://api.thegraph.com/subgraphs/name/1hive/uniswap-v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
  })
    .then(r => r.json())
    .then(({ data: { token } }) => {
      const embed = new Discord.MessageEmbed()
        .setColor('#ff006c')
        .setTitle(`$${token.symbol} Token 🤸‍♀️`)
        .setURL('https://she.energy/swap')
        .setField({ name: 'Address', value: token.id })
        .setTimestamp()
        .setFooter(
          'Bot made by the Shenanigan team',
          'https://raw.githubusercontent.com/ShenaniganDApp/wiki/master/images/Particle.png',
        )
      message.reply(embed)
    })
}
