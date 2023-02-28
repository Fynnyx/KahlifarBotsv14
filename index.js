const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js")
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits
const { User, Message, GuildMember, ThreadMember } = Partials
const dotenv = require("dotenv")

const { loadEvents } = require("./loader/eventHandler")


dotenv.config()

const client = new Client({
	intents: [
		Guilds,
		GuildMembers,
		GuildMessages
	],
	partials: [
		User,
		Message,
		GuildMember,
		ThreadMember
	],
});

client.config = require("./properties.json")
client.events = new Collection()
client.commands = new Collection()

// Load events, commands
loadEvents(client)


client.login(process.env.TOKEN)
