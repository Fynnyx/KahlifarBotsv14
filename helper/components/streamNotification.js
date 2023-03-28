const moment = require("moment");
const { getChannelByTwitchName, updateChannel, getAllChannels } = require("../../helper/api/streamer");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");

const requestData = {
    headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
    }
}

async function startStreamNotificationInterval(client) {
    const streamNotificationInterval = setInterval(async () => {
        const channels = await getAllChannels();
        if (channels.isError) return client.logger.error(`Error while startStreamNotificationInterval\n` + channels.message)
        for (const channel of channels) {
            streamNotification(channel.twitchName, client);
        }

    }, client.config.streamNotification.interval * 1000);
}

async function streamNotification(name) {
    try {
        requestData.headers.Authorization = `Bearer ${await getOAuthToken()}`;
        const apiStream = await getChannelByTwitchName(name);
        if (apiStream.isError) {
            return client.logger.error(`Error while streamNotification\nWith Streamer ${name}\n` + apiStream.message)
        }

        if (!await channelIsLive(name)) return
        const streamData = await getStreamData(name);
        if (!streamData) return

        const channelData = await getChannelData(name);

        const embed = createStreamEmbed(streamData, channelData, client);

        if (apiStream.lastStreamId === streamData.id) {
            await updateStreamMessage(apiStream, embed, client);
        } else {
            const channel = await client.channels.fetch(client.config.channels.streamNotification);
            const message = await channel.send({ embeds: [embed.embed], components: [embed.row] });
            apiStream.lastStreamId = streamData.id;
            apiStream.lastStreamMessageId = message.id;
            await updateChannel(apiStream.id, apiStream);
        }
    } catch (error) {
        client.logger.error(`Error while streamNotification\nWith Streamer ${name}\n` + error)
    }
}


// Auth
async function getOAuthToken() {
    try {
        const { data } = await axios.post("https://id.twitch.tv/oauth2/token", {
            client_id: process.env.TWITCH_CLIENT_ID,
            client_secret: process.env.TWITCH_CLIENT_SECRET,
            grant_type: "client_credentials",
        });
        return data.access_token;
    } catch (error) {
        client.logger.error("Error while getOAuthToken\n" + error)
    }
}

// is Live checker
async function channelIsLive(name) {
    try {
        const { data } = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${name}`, requestData);
        return data.data.length > 0;
    } catch (error) {
        client.logger.error("Error while channelIsLive\n" + error)
    }
}

// Get Data
async function getChannelData(name) {
    try {
        const { data } = await axios.get(`https://api.twitch.tv/helix/users?login=${name}`, requestData);
        return data.data[0];
    } catch (error) {
        client.logger.error("Error while getChannelData\n" + error)
    }
}

async function getStreamData(name) {
    try {
        const { data } = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${name}`, requestData);
        return data.data[0];
    } catch (error) {
        client.logger.error("Error while getStreamData\n" + error)
    }
}

// Embed
function createStreamEmbed(streamData, channelData, client) {
    const embed = new EmbedBuilder()
        .setTitle(`🔴 - ${streamData.user_name} streamt ${streamData.game_name}`)
        .setDescription(`** ${streamData.title}**`)
        .setURL(`https://twitch.tv/${channelData.login}`)

        .setColor(client.config.colors.purple)
        .setThumbnail(channelData.profile_image_url)
        .setImage(streamData.thumbnail_url.replace("{width}", "1920").replace("{height}", "1080"))
        .setFooter(`Started at ${moment(new Date(streamData.started_at)).format("DD.MM.YYYY HH:mm")}`)
        .setTimestamp()

        .addFields({
            name: "Viewers",
            value: streamData.viewer_count,
            inline: true
        }, {
            name: "Language",
            value: streamData.language,
            inline: true
        },
        {
            name: "Followers",
            value: channelData.followers_count,
            inline: true
        })

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setURL(`https://twitch.tv/${channelData.login}`)
                .setLabel(`Watch ${streamData.user_name}`)
                .setStyle("LINK")
        )
    return { embed, row};
}

async function updateStreamMessage(apiChannel, embed, client) {
    try {
        const channel = await client.channels.fetch(client.config.channels.streamNotification);
        const message = await channel.messages.fetch(apiChannel.lastMessageId);
        if (message) {
            return await message.edit({ embeds: [embed.embed], components: [embed.row] });
        }
        return await channel.send({ embeds: [embed.embed], components: [embed.row] });
    } catch (error) {
        client.logger.error("Error while updateStreamMessage\n" + error)
    }
}

module.exports = {
    startStreamNotificationInterval,
    streamNotification
}