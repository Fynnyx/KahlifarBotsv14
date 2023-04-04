const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { getConversation, updateConversation } = require('../../api/modmail/conversation')
const { getMainDCUser } = require('../../api/dcuser');
const moment = require('moment');


async function updateModmailMessages(conversationId, client) {
    const conversation = await getConversation(conversationId, client)
    if (conversation.isError) return
    const user = await getMainDCUser(conversation.user.discordUsers, client)
    const messages = conversation.messages

    const modChannel = client.channels.cache.get(client.config.channels.modMail)
    const discordUser = await client.users.fetch(user.discordId)

    let fields = await createFieldStrings(messages)

    const modmailEmbed = new EmbedBuilder()
        .setTitle(`${conversation.topic.name} - ${conversation.title}`)
        .setDescription("Description")
        .setColor(conversation.topic.color)
        .setThumbnail(discordUser.avatarURL())
        .setTimestamp()
        .setFooter({
            text: `ID: ${conversation.id}`
        })

    for (const field of fields) {
        modmailEmbed.addFields({
            name: '\u200b',
            value: field,
            inline: false
        })
    }

    const modmailModActions = (await createModmailActions())
    .addComponents(
        new ButtonBuilder()
            .setCustomId('modmail-ban')
            .setLabel("🚫 Ban")
            .setStyle(ButtonStyle.Danger),
    )

    modChannel.messages.fetch(conversation.lastMessageId)
        .then(async message => {
            message.edit({ embeds: [modmailEmbed], components: [modmailModActions] })
        })
        .catch(async error => {
            const modMessage = await modChannel.send({ embeds: [modmailEmbed], components: [modmailModActions], fetchReply: true })
            conversation.lastMessageId = modMessage.id
            await updateConversation(conversation.id, conversation, client)
        })
    await discordUser.send({ embeds: [modmailEmbed], components: [await createModmailActions()] })
}

async function createFieldStrings(messages) {
    let fieldStrings = []
    let currentFieldString = ""
    for (const message of messages) {
        const newMessageString = `**${message.user.username} at ${moment(new Date(message.datetime)).format("DD.MM.YYYY HH:mm")}**\n${message.content}\n\n`
        if (currentFieldString.length + newMessageString.length > 1024) {
            fieldStrings.push(currentFieldString)
            currentFieldString = ""
        }
        currentFieldString += newMessageString

    }
    fieldStrings.push(currentFieldString)
    return fieldStrings
}

async function createModmailActions() {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('modmail-reply')
                .setLabel("↩ Reply")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('modmail-close')
                .setLabel('🗃 Close')
                .setStyle(ButtonStyle.Danger),
        )

    return row
}

async function getIdFromFooterString(footerString) {
    const idString = footerString.split("ID: ")[1]
    return Number(idString)
}
module.exports = {
    updateModmailMessages,
    createModmailActions,
    getIdFromFooterString
}