const { EmbedBuilder } = require('discord.js');

createSendEmbed = (title, description, color, client) => {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: "-", iconURL: client.user.displayAvatarURL() })
        
    
    if (description) {
        embed.setDescription(description);
    }
    return embed;
}

handleSendMessage = async (message, embed, doDelete, ephemeral, client) => {
    var msg
    if (message.deferred) {
        msg = await message.editReply({content: null,  embeds: [embed], components: [], fetchReply: true })
    } else {
        msg = await message.reply({ embeds: [embed], ephemeral: ephemeral })
    }
    if (doDelete && !ephemeral) {
        await sleep(client.config.helpers.send.deleteTime)
        msg.delete()
    }
}


async function sendSuccess(title, description, message, client, doDelete=false, ephemeral=true) {
    let successEmbed = this.createSendEmbed(`✅ Success - ${title}`, description, client.config.colors.success, client)
    this.handleSendMessage(message, successEmbed, doDelete, ephemeral)
}


async function sendError(title = "An error occured", description, message, client, doDelete=false, ephemeral=true) {
    let errorEmbed = this.createSendEmbed(`❌ Error - ${title}`, description, client.config.colors.red, client)
    this.handleSendMessage(message, errorEmbed, doDelete, ephemeral)
}

async function sendInfo(title, description, message, client, doDelete=false, ephemeral=true) {
    let infoEmbed = this.createSendEmbed(`ℹ️ Info - ${title}`, description, client.config.colors.lightblue, client)
    this.handleSendMessage(message, infoEmbed, doDelete, ephemeral)
}

async function sendWarning(title, description, message, client, doDelete=false, ephemeral=true) {
    let warningEmbed = this.createSendEmbed(`⚠️ Warning - ${title}`, description, client.config.colors.yellow, client)
    this.handleSendMessage(message, warningEmbed, doDelete, ephemeral)
}

module.exports = {
    sendSuccess,
    sendError,
    sendInfo,
    sendWarning
}