const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getCMSText } = require('../../helper/cms/text');
const { sendError } = require('../../helper/util/send');
const { escapeFormatting } = require('../../helper/util/markdown');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('util')
        .setDescription("General util commands")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
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
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })
        switch(interaction.options.getSubcommand()) {
            case "news-template":
                const title = interaction.options.getString("title");
                const role = interaction.options.getRole("role");
                let text = "";
                (await getCMSText("news-template"))[0].attributes.texts.forEach(element => {
                    text += element.value;
                });

                await interaction.editReply({ content: "Please write the message you want to send in the next 5 minutes." });
                
                const collector = interaction.channel.createMessageCollector({
                    filter: (msg) => msg.author.id === interaction.user.id,
                    time: 5 * 60 * 1000,
                    max: 1
                });
                collector.on("collect", async (msg) => {
                    console.log(title);
                    text = text.replace("%TITLE%", title);
                    text = text.replace("%ROLE%", role.toString());
                    text = text.replace("%MESSAGE%", msg.content);
                    msg.delete();
                    await interaction.editReply({ content: escapeFormatting(text) });
                });
                collector.on("end", async (collected) => {
                    if (collected.size === 0) return sendError("No content provided", "You didn't send a message in time.\n*You can write the message before executing the command and copy the text in.*", interaction, client);
                });

        }
    }
}