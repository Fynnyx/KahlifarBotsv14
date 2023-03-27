const { SlashCommandBuilder } = require('@discordjs/builders');
const { sendSuccess, sendError } = require('../../helper/util/send');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears messages')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of messages to clear').setRequired(false)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        try {
            await interaction.deferReply({ ephemeral: true });
            const amount = interaction.options.getInteger('amount')
            const channel = interaction.channel;
            const messages = await channel.messages.fetch({ limit: amount == null || amount > 100 ? 100 : amount });
            let messageCounter = {
                deleted: 0,
                notDeletable: 0
            }
            for (const message of messages) {
                if (message[1].deletable) {
                    await message[1].delete();
                    messageCounter.deleted++;
                    continue;
                }
                messageCounter.notDeletable++;
            }
            return await sendSuccess("Deletion report", `${messageCounter.deleted} messages deleted.\n${messageCounter.notDeletable} messages could not be deleted.`, interaction, client);
        } catch (e) {
            client.logger.error(e.toString())
            return await sendError("Deletion Error", `${e.toString()}\n\n${messageCounter.deleted} message deleted.\n${messageCounter.notDeletable} messages could nt be deleted.`, interaction, client)
        }
    }
};