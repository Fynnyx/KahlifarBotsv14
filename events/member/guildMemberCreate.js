const moment = require('moment');
const { EmbedBuilder } = require("discord.js")
const { getDCUser, updateDCUser } = require("../../helper/api/dcuser")
const { registerNewUser } = require("../../helper/api/register")
const { getCMSText } = require("../../helper/cms/text")
const { updateChannels } = require("../../helper/components/statchannel")

module.exports = {
    name: 'guildMemberAdd',
    usage: 'guildMemberAdd',
    once: false,
    async execute(member, client) {
        try {
            const botRole = member.guild.roles.cache.get(client.config.roles.bot);
            if (member.user.bot) await member.roles.add(botRole);
            const welcomeChannel = client.channels.cache.get(client.config.channels.welcome);
            const textData = await getCMSText('userWelcome');
            if (textData[0]) {
                for (const text of textData[0].attributes.texts) {
                    welcomeChannel.send(text.value
                        .replace('%MEMBER%', member)
                    );
                }
            }

            const modConsole = client.channels.cache.get(client.config.channels.modConsole);
            const embed = new EmbedBuilder()
                .setTitle('Member Joined')
                .setDescription(`**${member}** joined the server`)
                .setColor(client.config.colors.success)
                .setTimestamp()

            const apiUser = await getDCUser(member.id)
            if (apiUser.isError !== true) {
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
            updateChannels(client)
            return modConsole.send({ embeds: [embed] });
        } catch (error) {
            client.logger.error("In Member join/register\n"+error);
        }
    }
}
