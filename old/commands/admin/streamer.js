const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { getAllChannels, createChannel, getChannelByTwitchName, deleteChannel } = require("../../helper/api/streamer");
const { getMainDCUser, getDCUser } = require("../../helper/api/dcuser");
const { sendError, sendSuccess } = require("../../helper/util/send");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("streamer")
        .setDescription("Modify the the streamer notification list")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add a streamer to the list")
                .addStringOption(option =>
                    option
                        .setName("streamer")
                        .setDescription("The Twitchname to add")
                        .setRequired(true)
                )
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("The user belonging to the channel")
                        .setRequired(false)
                )
                .addBooleanOption(option =>
                    option
                        .setName("pingable")
                        .setDescription("If users with the streamer role should be pinged")
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove a streamer from the list")
                .addStringOption(option =>
                    option
                        .setName("streamer")
                        .setDescription("The Twitchname to remove")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("List all registered streamer")
                .addBooleanOption(option =>
                    option
                        .setName("pingable")
                        .setDescription("If only pingable streamers should be listed")
                        .setRequired(false)
                )

        ),

    async execute(interaction, client) {
        const pingable = interaction.options.getBoolean("pingable") ? true : false
        const twitchName = interaction.options.getString("streamer")
        switch (interaction.options.getSubcommand()) {
            case "add":
                await interaction.deferReply()
                const channelExists = await getChannelByTwitchName(twitchName)
                if (!channelExists.isError) return sendError("Channel already exists", `The channel **${twitchName}** already exists in the list`, interaction, client)
                const user = interaction.options.getUser("user")
                let userId = null
                if (user) {
                    const apiDCUser = await getDCUser(user.id)
                    if (!apiDCUser.isError) {
                        userId = {
                            id: apiDCUser.id
                        }
                    }
                }
                await createChannel({
                    twitchName: twitchName,
                    doPing: pingable,
                    lastStreamId: null,
                    lastMessageId: null,
                    user: userId
                })
                sendSuccess("Channel added", `The channel **${twitchName}** was added to the list`, interaction, client)
                break;
            case "remove":
                await interaction.deferReply()
                const channel = await getChannelByTwitchName(twitchName)
                if (channel.isError) return sendError("Channel not found", `The channel **${twitchName}** was not found in the list`, interaction, client)
                const deleteChannelResponse = await deleteChannel(channel.id)
                if (deleteChannelResponse?.isError) return sendError("Error", `An error occured while deleting the channel **${twitchName}**\n${deleteChannelResponse.message}`, interaction, client);
                return sendSuccess("Channel removed", `The channel **${twitchName}** was removed from the list`, interaction, client)
                break;
            case "list":
                await interaction.deferReply()
                const streamers = await getAllChannels()
                const streamerEmbed = new EmbedBuilder()
                    .setTitle("Registered Streamers")
                    .setColor(client.config.colors.purple)
                    .setDescription("Here is a list of all registered streamers")
                for (const streamer of streamers) {
                    if (pingable) {
                        if (streamer.pingable) {
                            streamerEmbed.addFields({
                                name: streamer.twitchName,
                                value: `User: <@${streamer.user_id}>\nPingable: ${streamer.doPing}`
                            })
                        }
                    } else {
                        if (!streamer.user) {
                            streamerEmbed.addFields({
                                name: streamer.twitchName,
                                value: `-\nPingable: ${streamer.doPing}`
                            })
                            continue
                        }
                        const dcUser = await getMainDCUser(streamer.user.discordUsers)
                        let name = streamer.user.username
                        if (dcUser) {
                            name = await client.users.fetch(dcUser.discordId)
                        }
                        streamerEmbed.addFields({
                            name: streamer.twitchName,
                            value: `User: ${name}\nPingable: ${streamer.doPing}`
                        })
                    }
                }
                await interaction.editReply({ embeds: [streamerEmbed] })
                break;

            default:
                break;
        }
    }



}