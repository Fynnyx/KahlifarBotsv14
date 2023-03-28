const moment = require("moment")
const { EmbedBuilder, AuditLogEvent } = require("discord.js")
const { getDCUser, updateDCUser } = require("../../helper/api/dcuser")

module.exports = {
    name: 'guildMemberRemove',
    usage: 'guildMemberRemove',
    once: false,
    async execute(member, client) {
        try {
            const modConsole = client.channels.cache.get(client.config.channels.modConsole);
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.red)
                .setTimestamp()

            const apiUser = await getDCUser(member.id)

            if (!apiUser.isError) {
                embed.addFields(

                    { name: 'First joined', value: moment(new Date(apiUser.firstJoinDate)).format("DD.MM.YYYY HH:mm:ss"), inline: true },
                    { name: 'Last joined', value: moment(new Date(apiUser.leaveDate)).format("DD.MM.YYYY HH:mm:ss"), inline: true },
                    { name: 'Last joined', value: moment(new Date(apiUser.leaveDate)).fromNow(), inline: true },
                )

                // Set to current datetime
                apiUser.leaveDate = new Date();

                await updateDCUser(apiUser.id, apiUser);
            }

            // Fetch the Adit Log and evaluate if he left, got kicked or banned
            const banLogs = await member.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberBanAdd,
            });
            let banLog = {
                target: null,
                executor: null,
                reason: null,
                entry: null,
            }
            banLog.entry = banLogs.entries.first();
            if (!banLog.entry) return;
            if (banLog.entry.target.id == member.id) {
                banLog.target = banLog.entry.target;
                banLog.executor = banLog.entry.executor;
                banLog.reason = banLog.entry.reason;

                embed.setTitle('Member Banned')
                    .setDescription(`**${banLog.target.tag}** got banned by **${banLog.executor.tag}** for **${banLog.reason}**`)

                return modConsole.send({ embeds: [embed] });
            }

            const kickLogs = await member.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberKick,
            });
            let kickLog = {
                target: null,
                executor: null,
                reason: null,
                entry: null
            }
            kickLog.entry = kickLogs.entries.first();
            if (!kickLog.entry) return;
            if (kickLog.entry.target.id == member.id) {
                kickLog.target = kickLog.entry.target;
                kickLog.executor = kickLog.entry.executor;
                kickLog.reason = kickLog.entry.reason;

                embed.setTitle('Member Kicked')
                    .setDescription(`**${kickLog.target.tag}** got kicked by **${kickLog.executor.tag}** for **${kickLog.reason}**`)

                return modConsole.send({ embeds: [embed] });
            }

            embed.setTitle('Member Left')
                .setDescription(`**${member.user.tag}** left the server.`)

            return modConsole.send({ embeds: [embed] });
        } catch (error) {
            client.logger.error(error);
        }
    }
}