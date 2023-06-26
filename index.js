const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js")
const { logger } = require("./loader/logger")
const dotenv = require("dotenv")
const fs = require("fs")

const { loadEvents } = require("./loader/eventHandler")


dotenv.config()

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages,
	],
	partials: [
		Partials.User,
		Partials.Message,
		Partials.GuildMember,
		Partials.ThreadMember
	],
});
// Require the enviroment properties if they exist
if (!fs.existsSync(`./${process.env.ENVIRONMENT.toLowerCase()}-properties.json`)) {
	client.config = require("./properties.json")
} else {
	client.config = require(`./${process.env.ENVIRONMENT.toLowerCase()}-properties.json`)
}
client.events = new Collection()
client.commands = new Collection()
client.logger = logger

// Load events, commands
loadEvents(client)

client.login(process.env.TOKEN)

module.exports = { client }
