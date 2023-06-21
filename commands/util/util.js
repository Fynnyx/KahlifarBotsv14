const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('util')
        .setDescription("General util commands")
        .addSubcommand(subcommand => subcommand
            .setName("news-template")
            .setDescription("Create a copy paste new template")
            .addStringOption(option => option
                .setName("title")
                .setDescription("The headline of the news")
                .setRequired(true)
            )
            .addRoleOption(option => option
                .setName("role")
                .setDescription("The role that get pinged when sending the news.")
                .setRequired(true)
            )
        )
}