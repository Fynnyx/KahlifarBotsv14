const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help with the bot\'s commands!')
        .addStringOption(option => option
            .setName('command')
            .setDescription('The command to get help with.')
            .setRequired(false)
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const command = interaction.options.getString('command');
        const embed = new EmbedBuilder()

        if (command) {
            const cmd = client.commands.get(command);
            if (!cmd) return interaction.reply({ content: 'That\'s not a valid command!', ephemeral: true });

            embed.setTitle(`Help for ${cmd.data.name}`);
            embed.setDescription(cmd.data.description);
            let embedString = '';
            for (const option of cmd.data.options)
                embedString += `\`${option.name}\` - ${option.description}\n`;
            embed.addField('Options', embedString);
        } else {
            embed.setTitle('Kahlifar Bot Help');
            embed.setDescription('Here are all the commands you can use!');
            for (const command of client.commands) {
                embed.addField('Commands', client.commands.map(cmd => `\`${cmd.data.name}\` - ${cmd.data.description}`).join('\n'));
            }
        }
        interaction.reply({ embeds: [embed] });

    }
}