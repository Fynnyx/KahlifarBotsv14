const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { sendError } = require('../../helper/util/send');

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
        await interaction.deferReply();
        const command = interaction.options.getString('command');
        const embed = new EmbedBuilder()
            .setColor(client.config.colors.skyblue)

        if (command) {
            const cmd = client.commands.get(command);
            if (!cmd) return sendError('Error', 'That command doesn\'t exist!', interaction, client);

            embed.setTitle(`Help for ${cmd.data.name}`);
            embed.setDescription(cmd.data.description);
            let embedString = '';
            for (const option of cmd.data.options) {
                embedString += `\`${option.name}\` - ${option.description}\n`;
            }
            embed.addFields(
                { name: 'Options', value: embedString, inline: true }
            );
        } else {
            embed.setTitle('Kahlifar Bot Help');
            embed.setDescription('Here are all the commands you can use!');
            for (const command of client.commands) {
                // embed.addField('Commands', client.commands.map(cmd => `\`${cmd.data.name}\` - ${cmd.data.description}`).join('\n'));
                embed.addFields(
                    { name: command[1].data.name, value: command[1].data.description, inline: true }
                );
            }
        }
        interaction.editReply({ embeds: [embed] });

    }
}