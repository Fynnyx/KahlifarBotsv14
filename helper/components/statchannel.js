const { getAllStatChannel } = require('../api/util/statchannel')
async function updateChannel(client) {
    try {
        const statChannels = await getAllStatChannel()
        if (statChannels?.isError) return client.logger.error(statChannels.message);
        statChannels.forEach(async statChannel => {
            console.log(statChannel);
            client.channels.fetch(statChannel.channelId)
                .then(channel => {
                    if (channel) {
                        updateDiscordChannel(statChannel, channel, client)
                    }
                })
                .catch(e => {
                    client.logger.error("Stat Channel in discord not found")
                    const newChannel = client.channel.create({
                        name: "Creating new Statchannel",
                        
                    }
                    )
                })

        })
    } catch (e) {
        client.logger.error(e.message)
    }
}

async function updateDiscordChannel(statChannel, channel, client) {
    switch (statChannel.type) {
        case "ROLE":
            const role = await client.guilds.cache.get(statChannel.guildId).roles.fetch(statChannel.value)
            if (role) {
                channel.setName(`${statChannel.channelName.replace("%VALUE%", role.members.size)}`)
            }
            break;
    }
}

async function startStatChannelUpdateInterval(client, seconds = 10) {
    setInterval(() => {
        updateChannel(client)
    }, seconds * 1000)
}

module.exports = {
    updateChannel,
    startStatChannelUpdateInterval
}