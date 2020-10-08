const fetch = require('node-fetch')
const Discord = require('discord.js')

module.exports = async function score(message) {
  const Credaccount = await (
    await fetch(
      'https://raw.githubusercontent.com/ShenaniganDApp/scoreboard/gh-pages/output/accounts.json',
    )
  ).json()
  const objJSONtoString = JSON.stringify(Credaccount)

  // JSON to javascript
  const stringJSONtoJava = JSON.parse(objJSONtoString)
  const PREFIX = '!she'
  let args = message.content.substring(PREFIX.length).split(' ')

  // const intro = math.random()*10

  // let welcomingbot = Array([a,b,c,d,e,f,g,hi,j,k]);

  // it's not a robust search and fits only the structure of the output file that SourceCred spits out
  if (args.length < 2) {
    try {
      const targetName =
        'N\u0000sourcecred\u0000discord\u0000MEMBER\u0000user\u0000' +
        message.author.id +
        '\u0000'

      for (var i = 0; i < 3000; i++) {
        let idDiscord = stringJSONtoJava.accounts[i].account.identity

        const handler = {
          get(target, property) {
            return target[property]
          },
        }
        const proxyUser = new Proxy(idDiscord, handler)

        const noDiscordAdress = proxyUser.aliases.length

        console.log('bien lu')

        if (noDiscordAdress < 3) continue

        const findAdress = proxyUser.aliases[2]

        if (String(targetName) === String(findAdress.address)) {
          let myTotalCred = stringJSONtoJava.accounts[i].totalCred

          var lengthArray = stringJSONtoJava.accounts[i].cred.length

          let myWeeklyCred = stringJSONtoJava.accounts[i].cred

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

          message.channel.send(embed)

          return console.log('il y a un match' + i)
        }
      }
    } catch (err) {
      return message.channel.send(
        'Please, write this : !mycred *[your discord name]*',
      )
    }
  } else {
    const objJSONtoString = JSON.stringify(Credaccount)

    // JSON to javascript
    const stringJSONtoJava = JSON.parse(objJSONtoString)

    //en mode manuel
    const targetNameManual = args[1]

    let position = stringJSONtoJava.accounts.findIndex(
      a => a.account.identity.name === targetNameManual,
    )

    let myTotalCred = stringJSONtoJava.accounts[position].totalCred

    var lengthArrayManual = stringJSONtoJava.accounts[position].cred.length

    let myWeeklyCred = stringJSONtoJava.accounts[position].cred

    var variationManual =
      (100 * (myWeeklyCred[lengthArrayManual - 1] - myWeeklyCred[lengthArrayManual - 2])) /
      myWeeklyCred[lengthArrayManual - 2]

    let embed = new Discord.MessageEmbed()
      .setColor('#ff3864')
      .setDescription(' Hello ' + targetNameManual + '! You look nice today') //```\

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
          value: myWeeklyCred[lengthArrayManual - 1].toPrecision(3) + ' Cred',
          inline: true,
        },
        {
          name: 'Week before',
          value: myWeeklyCred[lengthArrayManual - 2].toPrecision(4) + ' Cred',
          inline: true,
        },
        {
          name: 'Weekly Change',
          value: variationManual.toPrecision(2) + '%',
        },
      )

    message.channel.send(embed)
  }
}
