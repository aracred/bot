const helpContent = `
Available AracredBot commands:

- !ac addaddress <username> <address> → Registers the user with username <username> with the Ethereum address <address>. Example:

> !ac addaddress foo 0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B

- !ac help → This command.

- !ac signup <username> <platform1/username> <platform2/username>... → Registers the user with username <username> with platforms <platform1/username> <platform2/username>... to be able to gain cred. Supported platforms: github, discourse and discord. NOTE: Discord will be linked to your username automatically. 

> !ac signup foo github/foo discourse/foo

`

module.exports = function help(message) {
  message.reply(helpContent)
}
