const { updateChannels } = require("../../helper/components/statchannel")


module.exports = {
    name: 'guildMemberUpdate',
    usage: 'guildMemberUpdate',
    once: false,
    async execute(member, oldmember, client) {
        try {
            if (member.roles != oldmember.roles) {
                updateChannels(client)

                // Limiter roles
                const guild = member.guild;
                const limiterRolePattern = /^◼+ *- *(.+?) *- *◼+$/;
                const limiterRoles = guild.roles.cache.filter(role => limiterRolePattern.test(role.name));

                console.log(limiterRoles);
                if (limiterRoles.size > 0) {
                    const currentRoles = member.roles.cache;
                    const highestRole = member.roles.highest;

                    const rolesBelowHighest = limiterRoles.filter(role => role.position < highestRole.position && currentRoles.has(role.id));

                    const missingRoles = limiterRoles.filter(role => !rolesBelowHighest.has(role.id));
                    console.log(missingRoles);
                    if (missingRoles.size > 0) {
                        missingRoles.forEach(role => {
                            member.roles.add(role)
                        });
                    }
                }
            }
        } catch (error) {
            client.logger.error(error)
        }
    }
}
