const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { getConversation } = require("../../helper/api/modmail/conversation");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('modmail')
        .setDescription('Modmail commands')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addSubcommandGroup(group =>
            group
                .setName('conversation')
                .setDescription('Conversation commands')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('get')
                        .setDescription('Get a conversation')
                        .addStringOption(option =>
                            option
                                .setName('id')
                                .setDescription('The conversation id')
                                .setRequired(true)
                        )
                )

        ),
    async execute(interaction, client) {

        switch (interaction.options.getSubcommandGroup()) {
            case 'conversation':
                switch (interaction.options.getSubcommand()) {
                    case 'get':
                        const id = interaction.options.getString('id')
                        const conversation = await getConversation(id, client)
                        await interaction.reply({ content: JSON.stringify(conversation), ephemeral: true })
                        break;
                }
        }
    },
}