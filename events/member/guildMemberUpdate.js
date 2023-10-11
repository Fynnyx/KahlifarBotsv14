const { updateChannels } = require("../../helper/components/statchannel")


module.exports = {
    name: 'guildMemberUpdate',
    usage: 'guildMemberUpdate',
    once: false,
    async execute(member, oldmember, client) {
        try {
            if (member.roles != oldmember.roles) {
                updateChannels(client)
            }
        } catch (error) {
            client.logger.error(error)
        }
    }
}
