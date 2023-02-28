const {ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, Client} = require('discord.js');
const {loadCommands} = require('../../loader/commandHandler');
const {loadEvents} = require('../../loader/eventHandler');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reload your commands/events.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ADMINISTRATOR)
        .addSubcommand(subcommand => subcommand
            .setName('commands')
            .setDescription('Reload your commands.'))
        .addSubcommand(subcommand => subcommand
            .setName('events')
            .setDescription('Reload your events.')),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case 'commands':
                console.info('Reloading commands...');
                await loadCommands(client);
                interaction.reply({
                    content: `Reloaded ${client.commands.size} commands!`,
                    ephemeral: true
                })
                break;
            case 'events':
                for (const [key, value] of client.events)
                client.removeListener(`${key}`, value, true);
                console.info('Reloading events...');
                await loadEvents(client);
                interaction.reply({
                    content: `Reloaded ${client.events.size} events!`,
                    ephemeral: true
                })
                break;
        }
    }
}
