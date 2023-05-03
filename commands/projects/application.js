const { SlashCommandBuilder } = require("discord.js");
const { checkUsername } = require("../../helper/components/games/minecraft");
const { sendError } = require("../../helper/util/send");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("application")
        .setDescription("Apply for a project")
        .addSubcommand(subcommand =>
            subcommand
                .setName("minecraft")
                .setDescription("Apply for the Minecraft project")
                .addStringOption(option =>
                    option.setName("minecraftname")
                        .setDescription("Your Minecraft username")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("age")
                        .setDescription("Your age")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("more")
                        .setDescription("Tell us more about yourself")
                        .setRequired(false)
                )
        ),
    async execute(interaction) {
        interaction.deferReply();
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "minecraft":
                const minecraftname = interaction.options.getString("minecraftname");
                const age = interaction.options.getString("age");
                const more = interaction.options.getString("more");

                const checkResponse = await checkUsername(minecraftname, interaction.client);
                console.log(checkResponse);
                if (checkResponse?.isError) {
                    return await sendError(description=checkResponse.message, message=interaction, client=interaction.client);
                }
        }
    }
        
}
