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
    console.log(message.deferred);
    msg = message.editReply({ embeds: [embed], fetchReply: true })
    // console.log(message.type);
}


exports.sendSuccess = async (title, description, message, client, doDelete=false, ephemeral=true) => {
    let successEmbed = this.createSendEmbed(`✅ Success - ${title}`, description, client.config.colors.success, client)
    this.handleSendMessage(message, successEmbed, doDelete, ephemeral)
}


exports.sendError = async (message, content, doDelete, ephemeral) => {
    var msg = {}
    let errorEmbed = new MessageEmbed()
        .setColor(data.helpers.send.colors.error)
        .setTitle(data.helpers.send.prefixTitle.error)
        .setDescription(content)
    if (message.type == "APPLICATION_COMMAND" || message.type == "MESSAGE_COMPONENT") {
        if (message.deferred || message.replied) {
            msg = message.editReply({ embeds: [errorEmbed], fetchReply: true, ephemeral: ephemeral })
        } else {
            msg = await message.reply({ embeds: [errorEmbed], fetchReply: true, ephemeral: ephemeral })
        }
    } else {
        msg = await message.channel.send({ embeds: [errorEmbed], fetchReply: true })
    }
    if (doDelete && !ephemeral) {
        await sleep(data.deleteTime)
        msg.delete()
    }
}