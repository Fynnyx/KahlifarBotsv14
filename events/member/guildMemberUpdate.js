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

                if (limiterRoles.size > 0) {
                    member = await member.fetch()
                    const currentRoles = member.roles.cache
                    const guildRoles = guild.roles.cache

                    // Find where position is the highest
                    const highestRole = member.roles.highest;
                    
                    // find position in guild and add all limiter roles below the highest member role 
                    const highestGuildRole = guildRoles.find(role => role.id === highestRole.id)
                    const highestRolePosition = highestGuildRole.position;
                    // find all limiter roles below the highest member role
                    const limiterRolesBelowHighest = limiterRoles.filter(role => role.position < highestRolePosition);

                    // add all missing limiter roles below the highest member role
                    const missingLimiterRoles = limiterRolesBelowHighest.filter(role => !currentRoles.has(role.id));
                    if (missingLimiterRoles.size > 0) {
                        member.roles.add(missingLimiterRoles);
                    }

                    // Remove limiter role if it is the highest
                    const limiterRoleToRemove = limiterRoles.find(role => role.position === highestRolePosition);
                    if (limiterRoleToRemove && currentRoles.has(limiterRoleToRemove.id)) {
                        member.roles.remove(limiterRoleToRemove);
                    }
                }
            }
        } catch (error) {
            client.logger.error(error)
        }
    }
}
