const { ChatInputCommandInteraction, Client, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Get all information about a user!')
        .addSubcommand(subcommand => subcommand
            .setName('get')
            .setDescription('Get all information about a user!')
            .addUserOption(option => option.setName('user').setDescription('The user you want to get information about').setRequired(true))
        )
        .addSubcommandGroup(subcommandgroup => subcommandgroup
            .setName('set')
            .setDescription('Set information about a user!')
            .addSubcommand(subcommand => subcommand
                .setName('birthday')
                .setDescription('Set a user\'s birthday')
                .addUserOption(option => option.setName('user').setDescription('The user you want to set the birthday of').setRequired(true))
                .addStringOption(option => option.setName('birthday').setDescription('The birthday you want to set').setRequired(true))
            )
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        subcommand = interaction.options.getSubcommand();
        subcommandgroup = interaction.options.getSubcommandGroup();

        const user = interaction.options.getUser('user');

        switch (subcommand) {
            case 'get':
                // Get user information

                break;
            case 'set':
                switch (subcommandgroup) {
                    case 'birthday':
                        const birthday = interaction.options.getString('birthday');

                        // Set user birthday
                        break;
                }
                break;
        }
        interaction.editReply({ content: 'This command is still in development!' });
    }
}
