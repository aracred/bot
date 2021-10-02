const helpContent = `
Available AracredBot commands:

- !ac help → This command.

- !ac signup <platform1/username> <platform2/username>... → Links your Discord account with platforms <platform1/username> <platform2/username>... to be able to gain cred. Supported platforms: github, discourse. NOTE: Discord will be linked to your username automatically.

> !ac signup github/foo discourse/foo

To link your Discord account with the Ethereum address. Run: !setAddress <address> [force]

`

module.exports = function help(message) {
  message.reply(helpContent)
}
