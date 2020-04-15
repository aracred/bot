const helpContent = `
Available AracredBot commands:

- !signup <username> <platform1/username> <platform2/username>... -> Registers an user with username <username> and platforms <platform1/username> <platform2/username>... to the project.json file to be able to gain cred. Supported platforms: github, discord, discourse. For linking discord, you'll need to put your Discord ID. Example:

> !signup foo github/foo discord/DISCORD_ID discourse/foo

- !addaddress <username> <address> -> Registers the user with username <username> and ethereum address <address> to the addressbook.json file.
`

module.exports = function help(message) {
  message.reply(helpContent)
}
