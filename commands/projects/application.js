const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { checkUsername } = require("../../helper/components/games/minecraft");
const { sendError, sendSuccess } = require("../../helper/util/send");
const { createApplication, userHasDouplicates } = require("../../helper/api/application");
const { getDCUser } = require("../../helper/api/dcuser");
const { applicationSetup } = require("../../helper/components/application/application");


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
                .addNumberOption(option =>
                    option.setName("age")
                        .setDescription("Your age")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("more")
                        .setDescription("Tell us more if needed")
                        .setRequired(false)
                )
        ),

    /**
     * @param { ChatInputCommandInteraction } interaction
     * @param { Client } client
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "minecraft":
                const SERVICEID = "MINECRAFT_KAHLIFAR";
                const minecraftname = interaction.options.getString("minecraftname");
                const age = interaction.options.getNumber("age");
                const more = interaction.options.getString("more");
                const checkResponse = await checkUsername(minecraftname, interaction.client);
                if (checkResponse?.isError) {
                    return await sendError("Error while sending message", checkResponse.message, interaction, client);
                }

                const applicationResponse = await applicationSetup(
                    interaction.user.id,
                    SERVICEID,
                    minecraftname
                )
                if (applicationResponse?.isError) {
                    return await sendError("Error while sending message", applicationResponse.message, interaction, client);
                }

                const modNewApplicationEmbed = new EmbedBuilder()
                    .setTitle(`New Application from ${interaction.user.tag}`)
                    .setDescription(`${SERVICEID}\n\n**Minecraft Username:** ${minecraftname}\n**Age:** ${age}\n**More:** ${more ? more : "-"}`)
                    .setTimestamp()
                    .setColor(client.config.colors.lightblue)
                    .setFooter({
                        text: `${applicationResponse.id}`,
                        iconURL: interaction.user.avatarURL()
                    });

                const modNewApplicationRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("modApplicationAccept")
                            .setLabel("Accept")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("modApplicationDeny")
                            .setLabel("Deny")
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId("modApplicationHelp")
                            .setLabel("Help")
                            .setStyle(ButtonStyle.Secondary)
                    )

                const modNewApplicationChannel = await client.channels.fetch(client.config.channels.application);
                const modNewApplicationMessage = await modNewApplicationChannel.send({
                    content: `<@&${client.config.roles.modNewApplication}>`,
                    embeds: [modNewApplicationEmbed],
                    components: [modNewApplicationRow]
                });

                await sendSuccess("Application sent!", `Your application \`#${applicationResponse.id}\` has been sent to the staff team. You will be notified when your application has been reviewed.\n\n*! Dont contact any staff team member via DM*`, interaction, client);
                break;
        }
    }

}
