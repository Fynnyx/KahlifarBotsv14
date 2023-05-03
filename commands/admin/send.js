const { ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { sendError, sendSuccess } = require('../../helper/util/send.js');
const { getCMSEmbed, createCMSEmbed } = require('../../helper/cms/embed.js');
const { getCMSText } = require('../../helper/cms/text.js');
const { getCMSSelect, createCMSSelect } = require('../../helper/cms/select.js');
const { isRoleSelect } = require('../../helper/components/select.js');
const { default: axios } = require('axios');

module.exports = {
    developer: false,
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Send a message to a channel!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
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
                        .setDescription('Send the information component to a channel!')
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('verify')
                        .setDescription('Send the verify Button to a channel!')
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('modmail')
                        .setDescription('Send the create modmail button to a channel!')
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

        if (subcommandGroup) {
            switch (subcommandGroup) {
                case 'extra':
                    switch (subcommand) {
                        case 'information':
                            let informationData = await axios.get(
                                `${process.env.CMS_URL}/api/information?populate[content][populate]=*`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${process.env.CMS_TOKEN}`,
                                    },
                                }
                            )
                            informationData = informationData.data
                            for (const contentItem of informationData.data.attributes.content) {
                                if (contentItem.__component == 'image.image') {
                                    const image = contentItem.image.data.attributes.url
                                    await channel.send({
                                        files: [process.env.CMS_URL + image]
                                    })
                                }
                                if (contentItem.__component == 'text.text') {
                                    const text = contentItem.value
                                    await channel.send(text)
                                }
                            }
                            return sendSuccess("Information sent", `Sent the **information** to the channel!`, interaction, client);
                        
                        case 'verify':
                            const verifyEmbedData = await getCMSEmbed('verify');
                            if (!verifyEmbedData[0]) return sendError("An error occured", 'No embed found with that name!', interaction, client);

                            const verifyEmbed = await createCMSEmbed(verifyEmbedData[0].attributes);
                            const verifyRow = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('verify')
                                        .setLabel('✅-Verify')
                                        .setStyle('Success')
                                )
                            await channel.send({
                                embeds: [verifyEmbed],
                                components: [verifyRow]
                            })
                            return sendSuccess("Verify sent", `Sent the **verify Component** to the channel!`, interaction, client);

                        case 'modmail':
                            const modmailEmbedData = await getCMSEmbed('modmail');
                            if (!modmailEmbedData[0]) return sendError("An error occured", 'No embed found with that name!', interaction, client);

                            const modmailEmbed = await createCMSEmbed(modmailEmbedData[0].attributes);
                            const modmailRow = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('modmail-createTicket')
                                        .setLabel('📩-Create Ticket')
                                        .setStyle(ButtonStyle.Primary)
                                )
                            await channel.send({
                                embeds: [modmailEmbed],
                                components: [modmailRow]
                            })
                            return sendSuccess("Modmail sent", `Sent the **modmail Component** to the channel!`, interaction, client);
                    }
                    break;
            }
        }

        switch (subcommand) {
            case 'embed':
                var embedData = await getCMSEmbed(name);
                if (!embedData[0]) return sendError("An error occured", 'No embed found with that name!', interaction, client);

                await channel.send({
                    embeds: [await createCMSEmbed(embedData[0].attributes)],
                });
                sendSuccess("Embed sent", `Sent the embed **${name} ** to the channel!`, interaction, client);
                break;
            case 'text':
                var textData = await getCMSText(name);
                if (!textData[0]) return sendError("An error occured", 'No text found with that name!', interaction, client);
                for (const text of textData[0].attributes.texts) {
                    await channel.send(text.value);
                }
                sendSuccess("Text sent", `Sent the text ** ${name}** to the channel!`, interaction, client);
                break;
            case 'select':
                var selectData = await getCMSSelect(name);
                let type
                if (!selectData[0]) return sendError("An error occured", 'No select found with that name!', interaction, client);

                if (await isRoleSelect(selectData[0].attributes.data.customId)) {
                    type = 'roles'
                }
                const row = new ActionRowBuilder()
                    .addComponents(
                        await createCMSSelect(selectData[0].attributes, type)
                    );


                await channel.send({
                    content: selectData[0].attributes.data.Message,
                    components: [row]
                });
                sendSuccess("Select sent", `Sent the select ** ${name}** to the channel!`, interaction, client);
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


