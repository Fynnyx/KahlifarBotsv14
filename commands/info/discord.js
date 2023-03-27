const { SlashCommandBuilder, ChatCommandInteraction } = require('@discordjs/builders');
const { Client } = require('discord.js');
const { getCMSSocials } = require('../../helper/cms/socials');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('discord')
        .setDescription('Get the Discord invite link'),
    /**
     * @param {ChatCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const discord = await getCMSSocials('Discord');
        await interaction.reply(`**Um neue Leute einzuladen verwende**\n- <${discord.data[0].attributes.URL}>`);
    }
};
