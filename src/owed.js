const { promises: fs } = require('fs')
const Discord = require("discord.js")
const client = new Discord.Client()
const addressBook = require("./addressbook.json")
const daoAddress = 'theDAOaddress'

async function readAddresses() {
    let contents = await fs.readFile('./owed.csv', {encoding: 'utf8'})

    contents = contents.trim().split("\n")

    for (content of contents) {
        let [address, balanceOwed] = content.split(",")
        let user = addressBook.find(function findUser(user) {
            return user.address === address
        })

        console.log(user.discordId)
        console.log("Hello user with address: " + address + ", you owe this much PRTCLE due to the distribution malfunction. Please send " + balanceOwed + " to the DAO address here: " + daoAddress)
    }
}

readAddresses()
