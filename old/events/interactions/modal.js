const moment = require('moment')
const { sendError, sendSuccess } = require('../../helper/util/send')
const { createQuote } = require('../../helper/api/util/quote')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'interactionCreate',
    usage: 'modals',
    async execute(interaction, client) {
        try {
            if (interaction.isModalSubmit()) {
                switch (interaction.customId) {
                    case 'quote-modal':
                        await interaction.deferReply({ ephemeral: true })
                        const source = interaction.fields.getTextInputValue('quote-source')
                        const date = interaction.fields.getTextInputValue('quote-date')
                        const message = interaction.fields.getTextInputValue('quote-message')

                        // Check the date
                        if (moment(new Date(date), 'DD.MM.YYYY', true).isValid() == false) {
                            await sendError("Quote", `Invalid date. Use the DD.MM.YYYY`, interaction, client)
                            return
                        }

                        const quote = await createQuote({
                            source: source,
                            date: date,
                            quote: message,
                            author: interaction.user.username
                        })
                        if (quote.isError) {
                            await sendError("Quote", `Error while quoting\n${quote.message}`, interaction, client)
                            return
                        }
                        const quoteEmbed = new EmbedBuilder()
                            .setDescription(
                                `\`\`\`${quote.quote}\n- ${quote.source} (${moment(new Date(quote.date)).format("DD.MM.YYYY")})\`\`\`\n`
                            )
                            .setFooter({ text: `Quoted by ${quote.author}` })
                            .setTimestamp()
                            .setColor(client.config.colors.lightblue)
                        const quoteChannel = client.channels.cache.get(client.config.channels.quotes)


                        await quoteChannel.send({ embeds: [quoteEmbed] })

                        await sendSuccess("Quote", `Quote created`, interaction, client)
                        break;
                }
            }
        } catch (error) {
            client.logger.error(error);
            await sendError("Quote", `Error while quoting\n${error}`, interaction, client)
        }
    }
}