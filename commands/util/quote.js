const { ModalBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Quote a message'),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        try {
            const modal = new ModalBuilder()
                .setTitle('Quote a message')
                .setCustomId('quote-modal')

            const sourceRow = new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('quote-source')
                        .setLabel('Wer hat es gesagt?')
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(32)
                )
            modal.addComponents(sourceRow)
            const dateRow = new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('quote-date')
                        .setLabel('Wann hat die Person es gesagt?')
                        .setStyle(TextInputStyle.Short)
                )
            modal.addComponents(dateRow)
            const messageRow = new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('quote-message')
                        .setLabel('Message...')
                        .setStyle(TextInputStyle.Paragraph)
                        .setMaxLength(1500)
                        .setMinLength(10)
                )
            modal.addComponents(messageRow)

            await interaction.showModal(modal)
        } catch (error) {
            client.logger.error(error);
            await sendError("Quote", `Error while quoting\n${error}`, interaction, client)
        }
    }
}
