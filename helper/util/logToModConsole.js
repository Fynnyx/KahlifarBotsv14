const { EmbedBuilder } = require("discord.js")
const data = require(`${process.cwd()}/properties.json`)



async function logToModConsole(title, value, color, client) {
    let channel = client.channels.cache.get(client.config.channels.modConsole)
    let logEmbed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(value)
        .setTimestamp()
    channel.send({ embeds: [logEmbed]})
}

module.exports = {
    logToModConsole
}
