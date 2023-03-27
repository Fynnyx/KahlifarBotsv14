const { EmbedBuilder, AuditLogEvent } = require("discord.js")
const { getDCUser } = require("../../helper/api/dcuser")

module.exports = {
    name: 'guildMemberDelete',
    once: false,
    async execute(member) {
        const embed = new EmbedBuilder()

        const apiUser =  await getDCUser(member.id)

        // Fetch the Adit Log and evaluate if he left, got kicked or banned
        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanAdd,
        });
    }
}