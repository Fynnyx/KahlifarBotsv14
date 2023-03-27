const moment = require('moment');
const { EmbedBuilder } = require("discord.js")
const { getDCUser, updateDCUser } = require("../../helper/api/dcuser")
const { registerNewUser } = require("../../helper/api/register")

module.exports = {
    name: 'guildMemberAdd',
    usage: 'guildMemberAdd',
    once: false,
    async execute(member, client) {
        try {
            const modConsole = client.channels.cache.get(client.config.channels.modConsole);
            const embed = new EmbedBuilder()
                .setTitle('Member Joined')
                .setDescription(`**${member}** joined the server`)
                .setColor(client.config.colors.success)
                .setTimestamp()

            const apiUser = await getDCUser(member.id)

            if (!apiUser.isError) {
                embed.addFields(
                    { name: 'First joined', value: moment(new Date(apiUser.firstJoinDate)).format("DD.MM.YYYY HH:mm:ss"), inline: true },
                    { name: 'Last joined', value: moment(new Date(apiUser.lastJoinDate)).format("DD.MM.YYYY HH:mm:ss"), inline: true },
                    { name: 'Member since', value: moment(new Date(apiUser.firstJoinDate)).fromNow(), inline: true },
                )

                // Set to current datetime
                apiUser.lastJoinDate = new Date();

                await updateDCUser(apiUser.id, apiUser);
            } else {

                const newMemberReturn = await registerNewUser(member);
                if (newMemberReturn == true) {
                    embed.addFields(
                        { name: 'Successfully registered new user', value: member.user.tag, inline: true }
                    )
                } else {
                    embed.addFields(
                        { name: 'An error occured', value: newMemberReturn, inline: true }
                    )
                }
            }

            return modConsole.send({ embeds: [embed] });
        } catch (error) {
            client.logger.error(error);
        }
    }
}
