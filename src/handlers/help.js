const helpContent = `
Available AracredBot commands:

- !addaddress <username> <address> -> Registers the user with username <username> with the Ethereum address <address>. Example:

> !addaddress foo 0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B

- !help -> This command.

- !signup <username> <platform1/username> <platform2/username>... -> Registers the user with username <username> with platforms <platform1/username> <platform2/username>... to be able to gain cred. Supported platforms: github, discord, discourse. For linking discord, you'll need to put your Discord ID. Example:

> !signup foo github/foo discord/DISCORD_ID discourse/foo

`

module.exports = function help(message) {
  message.reply(helpContent)
}
