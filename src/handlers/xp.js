const fetch = require('node-fetch')
const { error, log } = require('../utils')
const parseMyCred = require('../parser/myCred')
const { environment } = require('../environment')
const MessageEmbed = require('discord.js').MessageEmbed
const NodeAddress = require('../sourcecred-utils')

const filterMultipleDiscordAccounts = (discordAccount, targetUserDiscordID) => {
  const discordId = NodeAddress.toParts(discordAccount.address)[4]
  if (discordId === targetUserDiscordID) {
    return discordId
  }
  return undefined
}

const filterAccount = (obj, targetUserDiscordID) => {
  // Ignore if the target isn't a USER
  if (obj.account.identity.subtype !== 'USER') return false
  const discordAlias = obj.account.identity.aliases.filter(
    alias => {
      const parts = NodeAddress.toParts(alias.address)
      return parts.indexOf('discord') > 0
    })
  if (discordAlias.length >= 1) {
    // Retrieve the Discord ID
    const discordId = discordAlias.find(discordAccount => filterMultipleDiscordAccounts(discordAccount, targetUserDiscordID))
    if (discordId !== undefined){
      return obj
    }
  }
  return false
}

const getDiscordID = (targetParameter) => {
  // Parse the targetParameter
  // desktop/web user if starts with <@! and ends with >
  // mobile user if starts with <@ and ends with >
  if (targetParameter.startsWith('<@!') && targetParameter.endsWith('>')) {
    return targetParameter.slice(3, targetParameter.length - 1)
  } else if (targetParameter.startsWith('<@') && targetParameter.endsWith('>')) {
    return targetParameter.slice(2, targetParameter.length - 1)
  } else {
    throw new Error('Wrong argument for target parameter')
  }
}

const scoreFind = async (message) => {
  try {
    // Parse message.content to get the targeted user
    const targetParameter = parseMyCred(message.content)
    // Remove the first characters <@! and the last > to get the Discord ID
    const targetUserDiscordID = getDiscordID(targetParameter)
    if (isNaN(targetUserDiscordID)) {
      return message.reply(
        'You must tag a user to use this command, try `!ac xp @your-discord-username` or `!ac help` if you need help',
      )
    }

    // Fetch accounts.json containing the xp
    const credAccounts = await (
      await fetch(`https://raw.githubusercontent.com/${environment('GITHUB_ACCOUNT_FILE_PATH')}`,
      )
    ).json()
    const accounts = credAccounts.accounts
    // Retrieve the Discord ID targeted
    const user = accounts.find(account => filterAccount(account, targetUserDiscordID))
    if (user !== undefined) {
      const userTotalCred = user.totalCred
      const lengthArray = user.cred.length
      const userWeeklyCred = user.cred
      const variation =
        (100 *
          (userWeeklyCred[lengthArray - 1] - userWeeklyCred[lengthArray - 2])) /
        userWeeklyCred[lengthArray - 2]

      let embed = new MessageEmbed()
        .setColor('#ff3864')
        .setDescription(`${targetParameter}, please find your XP progression on ${environment('PROJECT_NAME')}`) //```\
        .setTitle(`${environment('PROJECT_NAME')} XP Ledger`)
        .setURL(environment('GITHUB_LEDGER_EXPLORER_PATH')) //
        .setTimestamp()
        .setThumbnail(
          'https://raw.githubusercontent.com/sourcecred/sourcecred/master/src/assets/logo/rasterized/logo_64.png',
        )
        .addFields(
          {
            name: 'Total',
            value: Math.round(userTotalCred) + ' XP',
            inline: true,
          },
          {
            name: 'Last week ',
            value: userWeeklyCred[lengthArray - 1].toPrecision(3) + ' XP',
            inline: true,
          },
          {
            name: 'Week before',
            value: userWeeklyCred[lengthArray - 2].toPrecision(4) + ' XP',
            inline: true,
          },
          {
            name: 'Weekly Change',
            value: variation.toPrecision(2) + '%',
            inline: true,
          },
        )
        .setFooter(
          'Bot made by MetaFam',
          'https://wiki.metagame.wtf/img/mg-crystal.png',
        )
      message.reply(embed)
      return log(`Fetched XP for user ${targetParameter}`)
    }
    log(`${targetParameter} not found in accounts.json`)
    return message.reply(`looks like we couldn't find ${targetParameter}! Make sure to register to use this command!`)
  } catch (err) {
    error(err)
    message.reply(
      'Command parsing failed. Please use the !ac help command to see how to use the requested command properly.',
    )
  }
}

module.exports = scoreFind