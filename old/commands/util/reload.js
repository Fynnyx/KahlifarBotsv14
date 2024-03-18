const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, Client } = require('discord.js');
const { sendInfo, sendSuccess } = require('../../helper/util/send');
const { loadCommands } = require('../../loader/commandHandler');
const { loadEvents } = require('../../loader/eventHandler');
const { cli } = require('winston/lib/winston/config');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reload your commands/events.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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
        await interaction.deferReply({ ephemeral: true });
        try {
            const subcommand = interaction.options.getSubcommand();
            switch (subcommand) {
                case 'commands':
                    client.logger.info('Reloading commands...');
                    await sendInfo("Reload", "Reloading commands...", interaction, client)
                    await loadCommands(client);
                    client.logger.info(`Reloaded ${client.commands.size} commands!`);
                    await sendSuccess("Reload", `Reloaded ${client.commands.size} commands!`, interaction, client)
                    break;
                case 'events':
                    for (const [key, value] of client.events)
                        client.removeListener(`${key}`, value, true);
                    client.logger.info('Reloading events...');
                    await sendInfo("Reload", "Reloading events...", interaction, client)
                    await loadEvents(client);
                    client.logger.info(`Reloaded ${client.events.size} events!`);
                    await sendSuccess("Reload", `Reloaded ${client.events.size} events!`, interaction, client)
                    break;
            }
        } catch (error) {
            client.logger.error(error);
            await sendError("Reload", `Error while reloading\n${error}`, interaction, client)
        }
    }
}
