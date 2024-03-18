const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { getAllStatChannel, updateStatChannel } = require('../api/util/statchannel')
async function updateChannels(client) {
    try {
        const statChannels = await getAllStatChannel()
        if (statChannels?.isError) return client.logger.error(statChannels.message);
        statChannels.forEach(async statChannel => {
            client.channels.fetch(statChannel.channelId)
                .then(channel => {
                    if (channel) {
                        updateDiscordChannel(statChannel, channel, client)
                    } else {
                        throw new Error("Channel not found")
                    }
                })
                .catch(async e => {
                    client.logger.info("Stat Channel in discord not found. Creating new one")
                    const category = client.channels.cache.get(statChannel.channelCategoryId)
                    const channel = await client.guilds.cache.get(client.config.guildId).channels.create({
                        name: "Creating new Statchannel",
                        type: ChannelType.GuildVoice,
                        parent: category ? category : null,
                        // Disallow connect for everyone
                        permissionOverwrites: [
                            {
                                id: client.config.guildId,
                                deny: [
                                    PermissionFlagsBits.Connect
                                ]
                            }
                        ]
                    })

                    statChannel.channelId = channel.id
                    const update = await updateStatChannel(statChannel.id, statChannel)

                    updateDiscordChannel(statChannel, channel, client)
                })
        })
    } catch (e) {
        client.logger.error(e)
    }
}

async function updateDiscordChannel(statChannel, channel, client) {
    switch (statChannel.type) {
        case "ROLE":
            let members = await client.guilds.cache.get(client.config.guildId).members.fetch()
            members = members.filter(member => member.roles.cache.has(statChannel.value));
            channel.setName(`${statChannel.channelName.replace("%VALUE%", members.size)}`)
            break;
    }
}

async function startStatChannelUpdateInterval(client, seconds = 10) {
    setInterval(() => {
        updateChannels(client)
    }, seconds * 1000)
}

module.exports = {
    updateChannels,
    startStatChannelUpdateInterval
}