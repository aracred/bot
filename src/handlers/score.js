const sc = require('sourcecred').default
const fetch = require('node-fetch')
const Discord = require('discord.js')
const { log } = require('../utils')

const NodeAddress = sc.core.address.makeAddressModule({
  name: 'NodeAddress',
  nonce: 'N',
  otherNonces: new Map().set('E', 'EdgeAddress'),
})

module.exports = async function score(message) {
  const credAccounts = await (
    await fetch(
      'https://raw.githubusercontent.com/ShenaniganDApp/scoreboard/gh-pages/output/accounts.json',
    )
  ).json()
  
  try {
    const accounts = credAccounts.accounts
    for (var i = 0; i < accounts.length; i++) {
      if (accounts[i].account.identity.subtype !== 'USER') continue
      console.log('accounts[i].account.: ', accounts[i].account)

      const discordAliases = accounts[i].account.identity.aliases.filter(
        alias => {
          const parts = NodeAddress.toParts(alias.address)
          return parts.indexOf('discord') > 0
        },
      )
      //no user on discord
      if (!discordAliases.length) continue

      let myTotalCred = 0
      let lengthArray = 0
      let myWeeklyCred = 0
      console.log(accounts[i].totalCred)
      discordAliases.forEach(alias => {
        const discordId = NodeAddress.toParts(alias.address)[4]
        if (discordId === message.author.id) {
          myTotalCred = accounts[i].totalCred

          lengthArray = accounts[i].cred.length

          myWeeklyCred = accounts[i].cred
        }
      })
      if (myTotalCred === 0) continue

      var variation =
        (100 *
          (myWeeklyCred[lengthArray - 1] - myWeeklyCred[lengthArray - 2])) /
        myWeeklyCred[lengthArray - 2]

      let embed = new Discord.MessageEmbed()
        .setColor('#ff3864')
        .setThumbnail(
          'https://raw.githubusercontent.com/sourcecred/sourcecred/master/src/assets/logo/rasterized/logo_64.png',
        )

        .addFields(
          {
            name: 'Total',
            value: Math.round(myTotalCred) + ' Cred',
            inline: true,
          },

          {
            name: 'Last week ',
            value: myWeeklyCred[lengthArray - 1].toPrecision(3) + ' Cred',
            inline: true,
          },
          {
            name: 'Week before',
            value: myWeeklyCred[lengthArray - 2].toPrecision(4) + ' Cred',
            inline: true,
          },
          {
            name: 'Weekly Change',
            value: variation.toPrecision(2) + '%',
          },
        )
      console.log('embed: ', embed)

      message.reply(embed)

      return console.log('il y a un match' + i)
    }
  } catch (err) {
    log('err: ', err)
    return message.reply('Whoops, seems you are missing!')
  }
}
