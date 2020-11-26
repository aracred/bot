const sc = require('sourcecred').default
const fetch = require('node-fetch')
const { log } = require('../utils')
const parseMyCred = require('../parser/myCred')
const { environment } = require('../environment')

module.exports = async function score(message) {
  const NodeAddress = sc.core.address.makeAddressModule({
    name: 'NodeAddress',
    nonce: 'N',
    otherNonces: new Map().set('E', 'EdgeAddress'),
  })

  const targetParameter = parseMyCred(message.content)
  const targetUserDiscordID = targetParameter.slice(3, targetParameter.length - 1)

  if (isNaN(targetUserDiscordID)) {
    return message.reply(
      'command parsing failed. Please use the !ac help command to see how to use the requested command properly.',
    )
  }

  const credAccounts = await (
    await fetch(`https://raw.githubusercontent.com/${environment('GITHUB_LEDGER_FILE_PATH')}`,
    )
  ).json()

  try {
    const accounts = credAccounts.accounts
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].account.identity.subtype !== 'USER') continue

      const discordAliases = accounts[i].account.identity.aliases.filter(
        alias => {
          const parts = NodeAddress.toParts(alias.address)
          return parts.indexOf('discord') > 0
        },
      )
      //no user on discord
      if (!discordAliases.length) continue

      let userTotalCred = 0
      let lengthArray = 0
      let userWeeklyCred = 0
      let found = false

      discordAliases.forEach(alias => {
        const discordId = NodeAddress.toParts(alias.address)[4]
        userTotalCred = accounts[i].totalCred
        lengthArray = accounts[i].cred.length
        userWeeklyCred = accounts[i].cred
        if (discordId === targetUserDiscordID) {
          found = true
        }
      })

      if (found) {
        let variation =
          (100 *
            (userWeeklyCred[lengthArray - 1] - userWeeklyCred[lengthArray - 2])) /
          userWeeklyCred[lengthArray - 2]

        const MessageEmbed = require('discord.js').MessageEmbed
        let embed = new MessageEmbed()
          .setColor('#ff3864')
          .setDescription(`${targetParameter}, please find your XP progression on MetaGame`) //```\
          .setTitle('MetaGame XP Ledger')
          .setURL('https://metafam.github.io/XP/#/explorer')
          .setTimestamp()
          .setThumbnail(
            'https://raw.githubusercontent.com/sourcecred/sourcecred/master/src/assets/logo/rasterized/logo_64.png',
          )
          .addFields(
            {
              name: 'Total',
              value: Math.round(userTotalCred) + ' Cred',
              inline: true,
            },
            {
              name: 'Last week ',
              value: userWeeklyCred[lengthArray - 1].toPrecision(3) + ' Cred',
              inline: true,
            },
            {
              name: 'Week before',
              value: userWeeklyCred[lengthArray - 2].toPrecision(4) + ' Cred',
              inline: true,
            },
            {
              name: 'Weekly Change',
              value: variation.toPrecision(2) + '%',
            },
          )
          .setFooter(
            'Bot made by MetaFam',
            'https://wiki.metagame.wtf/img/mg-crystal.png',
          )
        message.reply(embed)
        return log(`Fetched XP for user ${targetParameter}`)
      }
    }
    log(`${targetUserDiscordID} not found in ledger`)
    return message.reply(`Looks like we couldn't find you, ${targetParameter}, make sure to register! Please type !ac help to find out how!`)
  } catch (err) {
    log('err: ', err)
    message.reply(
      'Command parsing failed. Please use the !ac help command to see how to use the requested command properl   y.',
    )
  }
}
