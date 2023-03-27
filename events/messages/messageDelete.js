const { AuditLogEvent } = require("discord.js");
const { logToModConsole } = require("../../helper/util/logToModConsole");
const { getCMSCollection } = require("../../helper/cms/collection");

module.exports = {
    name: 'messageDelete',
    usage: 'messageDelete',
    async execute(message, client) {
        try {
            if (!message.guild) return;

            const fetchedLogs = await message.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MessageDelete,
            });
            const deletionLog = fetchedLogs.entries.first();
            if (message?.author?.bot) return;
            if (!message.author) return;
            const dellogDisabledChannels = await getCMSCollection("dellogChannels");
            for (const channel of dellogDisabledChannels.data[0].attributes.values) {
                if (channel.value === message.channel.id) return;
            }
            if (!deletionLog) return logToModConsole("Message Deleted", `Message by ${message.author} deleted in ${message.channel} but no relevant audit logs were found.`, client.config.colors.red, client);

            const { executor, target } = deletionLog;

            if (target.id === message.author.id) {
                return logToModConsole("Message Deleted", `Message by ${message.author} deleted in ${message.channel} by ${executor.tag}.`, client.config.colors.yellow, client);
            }
            return logToModConsole("Message Deleted", `Message by ${message.author} deleted in ${message.channel} but we don't know by who.`, client.config.colors.yellow, client);
        } catch (error) {
            client.logger.error("Error while messageDelete\n" + error)
        }
    },
};

