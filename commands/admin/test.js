const moment = require('moment');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AuditLogEvent, ChatInputCommandInteraction, Client, PermissionFlagsBits } = require("discord.js")
const { getDCUser, updateDCUser, registerDCUser } = require("../../helper/api/dcuser");
const { registerNewUser } = require('../../helper/api/register');
const { updateUser, getAllUsers } = require('../../helper/api/user');
const { createWallet } = require('../../helper/api/economy/wallet');
const { createEconomyInventory } = require('../../helper/api/economy/inventory');

module.exports = {
    developer: false,
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test something!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    /**
     * @param { ChatInputCommandInteraction } interaction
     * @param { Client } client
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        try {

            // const users = await getAllUsers();
            // let counter = 0;
            // for (const user of users) {
            //     if (user && user.economyInventory == null) {
            //         counter++;
            //         const newWallet = await createWallet({
            //             coins: 0,
            //             emeralds: 0
            //         });
            //         if (newWallet.isError) return console.log(newWallet.message);;
            //         const newEconomyInventory = await createEconomyInventory(newWallet.id, user.id)
            //         if (newEconomyInventory.isError) return console.log(newEconomyInventory.message);
            //     }
            // }
            // return interaction.editReply({ content: `Done! ${counter} users have been updated!` });


            // ! --------------------------------------------

            // Cycle through all members and change the username of the user in the database to the current username
            const members = await interaction.guild.members.fetch();
            for (const member of members.values()) {
                // Check if the member is a bot
                if (member.user.bot) continue;

                // get the user from the database
                const apiUser = await getDCUser(member.id);
                if (apiUser.isError) {
                    console.log(apiUser.message);
                    continue;
                };

                if (apiUser.user.username === member.user.username) continue;
                // Update the username
                apiUser.user.username = member.user.username;

                // Update the user in the database
                const update = await updateUser(apiUser.user.id, apiUser.user);
                if (update.isError) {
                    console.log(update.message);
                    continue;
                };
            }

            // ! --------------------------------------------

            // const dmChannel = await interaction.user.createDM();
            // for (const message of await dmChannel.messages.fetch()) {
            //     if (message[1].author.id !== client.user.id) continue;
            //     message[1].delete();
            // }

            // ! --------------------------------------------

            // Fetch all members from the guild
            // const members = await interaction.guild.members.fetch();

            // for (const member of members.values()) {
            //     // Check if the member is a bot
            //     if (member.user.bot) continue;

            //     // Check if the member is already registered
            //     const apiUser = await getDCUser(member.id);
            //     if (apiUser.isError) {
            //         // Register the member
            //         const response = await registerNewUser(member);
            //     }
            // }

            interaction.editReply({ content: 'Done!' });
        } catch (error) {
            interaction.editReply({ content: 'An error occured!\n' + error });
        }
    }
};