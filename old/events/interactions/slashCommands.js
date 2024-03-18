const { ChatInputCommandInteraction } = require('discord.js');
const { commandLogger } = require('../../loader/logger');
const { sendError } = require('../../helper/util/send');
module.exports = {
    name: 'interactionCreate',
    usage: 'slashCommands',
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return sendError('Command not found!', `Command ${interaction.commandName} not found!`, interaction, client)
            if (command.developer && interaction.user.id != client.config.developer) return interaction.reply(
                {
                    content: 'You don\'t have permission to use this command!',
                    ephemeral: true
                }
            );

            command.autocomplete(interaction, client);
        }
        if (interaction.isChatInputCommand()) {
            commandLogger.info(`${interaction.user.username} (${interaction.user.id}) executed /${interaction.commandName} in ${interaction.channel.name} (${interaction.channel.id})`)
            const command = client.commands.get(interaction.commandName);

            if (!command) return sendError('Command not found!', 'Command not found!', interaction, client)
            if (command.developer && interaction.user.id != client.config.developer) return interaction.reply(
                {
                    content: 'You don\'t have permission to use this command!',
                    ephemeral: true
                }
            );

            command.execute(interaction, client);
        }
    },
};