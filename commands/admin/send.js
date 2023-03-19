const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const { sendError, sendSuccess } = require('../../helper/util/send.js');
const { getCMSEmbed, createCMSEmbed } = require('../../helper/cms/embed.js');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Send a message to a channel!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('text')
                .setDescription('Send a text message to the current channel!')
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('The Text name in the cms')
                        .setRequired(true)

                )
                .addBooleanOption(option =>
                    option
                        .setName('clear')
                        .setDescription('Clear the channel before sending the message?')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('embed')
                .setDescription('Send an embed message to the current channel!')
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('The Embed name in the cms')
                        .setRequired(true)
                )
                .addBooleanOption(option =>
                    option
                        .setName('clear')
                        .setDescription('Clear the channel before sending the message?')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('select')
                .setDescription('Send a select dropdown to the current channel!')
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('The Select name in the cms')
                        .setRequired(true)
                )
                .addBooleanOption(option =>
                    option
                        .setName('clear')
                        .setDescription('Clear the channel before sending the message?')
                        .setRequired(false)
                )
        )
        .addSubcommandGroup(group =>
            group
                .setName('extra')
                .setDescription('Extra commands!')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('information')
                        .setDescription('Send a message to a channel!')
                )
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        const subcommand = interaction.options.getSubcommand();
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const name = interaction.options.getString('name');
        const channel = interaction.channel;
        const clear = interaction.options.getBoolean('clear');

        if (clear) {
            await channel.bulkDelete(100);
        }

        switch (subcommand) {
            case 'embed':
                var embedData = await getCMSEmbed(name);
                if (!embedData[0]) return sendError("An error occured", 'No embed found with that name!', interaction, client );

                channel.send({
                    embeds: [await createCMSEmbed(embedData[0].attributes)],
                });
                sendSuccess("Embed sent", `Sent the embed **${name}** to the channel!`, interaction, client);
                break;
            default:
                return sendError(
                    "An error occured",
                    'No subcommand group found!',
                    interaction,
                    client
                );
        }
    }
};


