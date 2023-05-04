const { getAllStatChannel } = require('../api/util/statchannel')
async function updateChannel(client) {
    try {
        const statChannels = await getAllStatChannel()
        if (statChannels?.isError) return client.logger.error(statChannels.message);
        console.log(statChannels);
        statChannels.forEach(async statChannel => {
            console.log(statChannel);
            const channel = await client.channels.fetch(statChannel.channelId)
            const  role = await client.guilds.cache.get(statChannel.guildId).roles.fetch(statChannel.value)
            if (channel) {
                
            }
        })
    } catch (e) {
        client.logger.error(e.message)
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