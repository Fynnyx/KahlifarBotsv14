const { EmbedBuilder } = require("discord.js")
const data = require(`${process.cwd()}/properties.json`)



exports.logToModConsole = async (title, value, color, client) => {
    let channel = client.channels.cache.get(client.config.channels.modConsole)
    let logEmbed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(value)
        .setTimestamp()
        .setFooter()

    channel.send({ embeds: [logEmbed]})
}