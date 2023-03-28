const moment = require('moment');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AuditLogEvent, ChatInputCommandInteraction, Client } = require("discord.js")
const { getDCUser, updateDCUser } = require("../../helper/api/dcuser")

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test something!'),
    /**
     * @param { ChatInputCommandInteraction } interaction
     * @param { Client } client
     */
    async execute(interaction, client) {
        await interaction.reply('Test');
        const member = interaction.member;
        
    }
};