const helpContent = `
Available Team Manager commands:

- !she addaddress <address> → Links your Discord account with the Ethereum address <address>. Example:

> !she addaddress 0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B

- !she token → Shows the $PRTCLE token

- !she score → View your weekly score from the scoreboard

- !she intro → Use this command in #👋_-introductions-_👋 to join the discord

- !she help → This command.

`

module.exports = function help(message) {
  message.reply(helpContent)
}
