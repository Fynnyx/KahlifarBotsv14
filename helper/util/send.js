const { EmbedBuilder } = require('discord.js');

exports.createSendEmbed = (title, description, color, client) => {
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

exports.handleSendMessage = async (message, embed, doDelete, ephemeral, client) => {
    var msg
    msg = message.editReply({ embeds: [embed], fetchReply: true })
    if (doDelete && !ephemeral) {
        await sleep(client.config.helpers.send.deleteTime)
        msg.delete()
    }
}


exports.sendSuccess = async (title, description, message, client, doDelete=false, ephemeral=true) => {
    let successEmbed = this.createSendEmbed(`✅ Success - ${title}`, description, client.config.colors.success, client)
    this.handleSendMessage(message, successEmbed, doDelete, ephemeral)
}


exports.sendError = async (title = "An error occured", description, message, client, doDelete=false, ephemeral=true) => {
    let errorEmbed = this.createSendEmbed(`❌ Error - ${title}`, description, client.config.colors.red, client)
    this.handleSendMessage(message, errorEmbed, doDelete, ephemeral)
}

exports.sendInfo = async (title, description, message, client, doDelete=false, ephemeral=true) => {
    let infoEmbed = this.createSendEmbed(`ℹ️ Info - ${title}`, description, client.config.colors.lightblue, client)
    this.handleSendMessage(message, infoEmbed, doDelete, ephemeral)
}

exports.sendWarning = async (title, description, message, client, doDelete=false, ephemeral=true) => {
    let warningEmbed = this.createSendEmbed(`⚠️ Warning - ${title}`, description, client.config.colors.yellow, client)
    this.handleSendMessage(message, warningEmbed, doDelete, ephemeral)
}