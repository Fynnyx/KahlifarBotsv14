const moment = require('moment');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AuditLogEvent, ChatInputCommandInteraction, Client, PermissionFlagsBits } = require("discord.js")
const { getDCUser, updateDCUser, registerDCUser } = require("../../helper/api/dcuser");
const { registerNewUser } = require('../../helper/api/register');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test something!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param { ChatInputCommandInteraction } interaction
     * @param { Client } client
     */
    async execute(interaction, client) {
        interaction.deferReply({ ephemeral: true });

        try {
            // const dmChannel = await interaction.user.createDM();
            // console.log(dmChannel.messages);
            // for (const message of await dmChannel.messages.fetch()) {
            //     console.log(message);
            //     if (message[1].author.id !== client.user.id) continue;
            //     message[1].delete();
            // }

            // ! --------------------------------------------

            // Fetch all members from the guild
            const members = await interaction.guild.members.fetch();

            for (const member of members.values()) {
                // Check if the member is a bot
                if (member.user.bot) continue;

                // Check if the member is already registered
                const apiUser = await getDCUser(member.id);
                console.log(apiUser);
                if (apiUser.isError) {
                    // Register the member
                    const response = await registerNewUser(member);
                    console.log(response);
                }
            }

            interaction.editReply({ content: 'Done!' });
        } catch (error) {
            console.log(error);
            interaction.editReply({ content: 'An error occured!' });
        }
    }
};