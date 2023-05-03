const { ModalBuilder, TextInputBuilder, StringSelectMenuBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js")
const { getAllTopics } = require("../../helper/api/modmail/topics")
const { createMessage } = require("../../helper/api/modmail/messages")
const { createConversation } = require("../../helper/api/modmail/conversation")
const { updateModmailMessages, getIdFromFooterString } = require("../../helper/components/modmail/modmail")
const { getDCUser } = require("../../helper/api/dcuser")
const { sendError, sendSuccess } = require("../../helper/util/send")
const { disableButton, enableButton } = require("../../helper/components/buttons")

module.exports = {
    name: 'interactionCreate',
    usage: 'modmail',
    async execute(interaction, client) {
        if (interaction.isButton()) {
            switch (interaction.customId) {
                case 'modmail-createTicket':
                    // Create modal
                    const modal = new ModalBuilder()
                        .setTitle('Create a ticket')
                        .setCustomId('modmail-createTicket-modal')


                    const row = new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId('modmail-createTicket-title')
                                .setLabel('Title')
                                .setStyle(TextInputStyle.Short)
                        )

                    const row2 = new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId('modmail-createTicket-message')
                                .setLabel('Message')
                                .setStyle(TextInputStyle.Paragraph),
                        )

                    modal.addComponents(row, row2)

                    await interaction.showModal(modal)
                    break;

                case 'modmail-reply':
                    await interaction.deferReply({ ephemeral: true })
                    const channel = await client.channels.fetch(interaction.channelId)
                    await disableButton(interaction.message)
                    const conversationId = await getIdFromFooterString(interaction.message.embeds[0].footer.text)
                    const user = (await getDCUser(interaction.user.id)).user

                    // Wait for user to send message
                    const filter = m => m.author.id == interaction.user.id
                    const collector = channel.createMessageCollector({ filter, time: 10 * 1000, max: 1 })

                    await interaction.editReply({ content: 'Please send your message.', components: [] })
                    collector.on('collect', async message => {
                        const messageResponse = await createMessage({
                            content: message.content,
                            conversation: {
                                id: Number(conversationId)
                            },
                            user: {
                                id: user.id
                            },
                        }, client)
                        // console.log(messageResponse);
                        await updateModmailMessages(conversationId, client)
                        await sendSuccess('Message sent.', 'Your message has been sent.\nThe staff team will get back to you as soon as possible.', interaction, client)
                        if (message.deletable) message.delete()
                        collector.stop()
                    })

                    collector.on('end', async collected => {
                        await enableButton(interaction.message)
                        if (collected.size === 0) {
                            return await sendError('No message send', 'You did not send a message in time.', interaction, client)
                        }
                        await sendSuccess('Message sent.', 'Your message has been sent.\nThe staff team will get back to you as soon as possible.', interaction, client)
                    })


            }
        } else if (interaction.isModalSubmit()) {
            switch (interaction.customId) {
                case 'modmail-createTicket-modal':
                    await interaction.deferReply({ ephemeral: true })
                    const title = interaction.fields.getTextInputValue('modmail-createTicket-title')
                    const message = interaction.fields.getTextInputValue('modmail-createTicket-message')
                    const user = (await getDCUser(interaction.user.id)).user

                    if (!title || !message) {
                        return await sendError(interaction, 'Please fill out all fields.')
                    }

                    const topics = await getAllTopics()

                    const topicSelect = new StringSelectMenuBuilder()
                        .setCustomId('modmail-createTicket-topic')
                        .setPlaceholder('Select a topic')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .addOptions(topics.map(topic => {
                            return {
                                label: topic.name,
                                description: topic.description,
                                value: topic.id.toString()
                            }
                        }))
                    const row = new ActionRowBuilder()
                        .addComponents(topicSelect)


                    interaction.editReply({
                        content: 'Select a topic',
                        components: [row],
                        ephemeral: true
                    })

                    // Wait for topic selection
                    const filter = i => i.customId === 'modmail-createTicket-topic' && i.user.id === interaction.user.id
                    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 })

                    collector.on('collect', async i => {
                        await interaction.editReply({
                            content: 'Topic selected!\n**Creating ticket...**',
                            components: [],
                            ephemeral: true
                        })
                        const topic = i.values[0]
                        // Create ticket
                        const conversation = await createConversation({
                            title: title,
                            user: {
                                id: user.id
                            },
                            topic: {
                                id: Number(topic),
                            }
                        },
                            client)

                        const newMessage = await createMessage({
                            conversation: {
                                id: conversation.id
                            },
                            content: message,
                            user: {
                                id: user.id
                            }
                        }, client)
                        // console.log(newMessage);
                        await updateModmailMessages(conversation.id, client)
                        await sendSuccess("Ticket created", `Your ticket has been created.\n${"**Ticket-ID:**\`#" + conversation.id + "\`"}`, i, client)
                    })
                    break;
            }
        }
    }
}
