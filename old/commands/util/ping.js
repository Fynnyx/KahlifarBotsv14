const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get the bot\'s ping!'),
        
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        interaction.reply({
            content: `**${client.ws.ping}**ms`,
            ephemeral: true
        })
    }
};