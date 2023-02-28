const { ChatInputCommandInteraction } = require('discord.js');
module.exports = {
    name: 'interactionCreate',
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;  

        const command = client.commands.get(interaction.commandName);

        if (!command) return interaction.reply(
            {
                content: 'There was an error while executing this command!',
                ephemeral: true
            }
        );
        if (command.developer && interaction.user.id != client.config.developer) return interaction.reply(
            {
                content: 'You don\'t have permission to use this command!',
                ephemeral: true
            }
        );

        command.execute(interaction, client);
    },
};