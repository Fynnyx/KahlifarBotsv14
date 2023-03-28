const moment = require("moment");
const axios = require("axios");
const { getChannelByTwitchName, updateChannel, getAllChannels } = require("../../helper/api/streamer");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

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
            console.log("Send StreamNotification for " + channel.twitchName);
            await streamNotification(channel.twitchName, client);
        }

    }, client.config.helpers.streamNotification.interval * 1000 * 60);
}

async function streamNotification(name, client) {
    // try {
    if (name == "test") return
    requestData.headers.Authorization = `Bearer ${await getOAuthToken()}`;
    const apiStream = await getChannelByTwitchName(name);
    if (apiStream.isError) {
        return client.logger.error(`Error while streamNotification\nWith Streamer ${name}\n` + apiStream.message)
    }

    if (!await channelIsLive(name)) return
    const streamData = await getStreamData(name);
    if (!streamData) return

    const channelData = await getChannelData(name);
    const followerData = await getFollowerData(streamData.user_id);

    const embed = createStreamEmbed(streamData, channelData, followerData, client);

    // console.log(apiStream.lastStreamId, streamData.id, apiStream.lastStreamId == streamData.id);
    // console.log(apiStream.lastMessageId);
    if (apiStream.lastStreamId == streamData.id) {
        await updateStreamMessage(apiStream, embed, client);
    } else {
        const channel = await client.channels.fetch(client.config.channels.streamNotification);
        const message = await channel.send({ embeds: [embed.embed], components: [embed.row] });
        apiStream.lastStreamId = streamData.id;
        apiStream.lastMessageId = message.id;
        await updateChannel(apiStream.id, apiStream);
    }
    // } catch (error) {
    //     client.logger.error(`Error while streamNotification\nWith Streamer ${name}\n` + error)
    // }
}


// Auth
async function getOAuthToken() {
    // try {
    const { data } = await axios.post("https://id.twitch.tv/oauth2/token", {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: "client_credentials",
    });
    return data.access_token;
    // } catch (error) {
    //     client.logger.error("Error while getOAuthToken\n" + error)
    // }
}

// is Live checker
async function channelIsLive(name) {
    // try {
    const { data } = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${name}`, requestData);
    return data.data.length > 0;
    // } catch (error) {
    //     client.logger.error("Error while channelIsLive\n" + error)
    // }
}

// Get Data
async function getChannelData(name) {
    // try {
    const { data } = await axios.get(`https://api.twitch.tv/helix/users?login=${name}`, requestData);
    return data.data[0];
    // } catch (error) {
    //     client.logger.error("Error while getChannelData\n" + error)
    // }
}

async function getStreamData(name) {
    // try {
    const { data } = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${name}`, requestData);
    return data.data[0];
    // } catch (error) {
    //     client.logger.error("Error while getStreamData\n" + error)
    // }
}

async function getFollowerData(streamerId) {
    // try {
    const { data } = await axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${streamerId}`, requestData);
    return data;
    // } catch (error) {
    //     client.logger.error("Error while getFollowerData\n" + error)
    // }
}

// Embed
function createStreamEmbed(streamData, channelData, followerData, client) {
    const embed = new EmbedBuilder()
        .setTitle(`🔴 - ${streamData.user_name} streamt ${streamData.game_name}`)
        .setDescription(`** ${streamData.title}**`)
        .setURL(`https://twitch.tv/${channelData.login}`)

        .setColor(client.config.colors.purple)
        .setThumbnail(channelData.profile_image_url)
        .setImage(streamData.thumbnail_url.replace("{width}", "1920").replace("{height}", "1080"))
        .setFooter({
            text: `Started at ${moment(streamData.started_at).format("DD.MM.YYYY HH:mm")}`
        })
        .setTimestamp()
        .addFields({
            name: "Viewers",
            value: streamData.viewer_count ? streamData.viewer_count.toString() : "*Could not be resolved*",
            inline: true
        },
            {
                name: "Language",
                value: streamData.language ? streamData.language : "*Could not be resolved*",
                inline: true
            },
            {
                name: "--------------------------",
                value: "\u200b",
                inline: false
            },
            {
                name: "Followers",
                value: followerData.total ? followerData.total.toString() : "*Could not be resolved*",
                inline: true
            })

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setURL(`https://twitch.tv/${channelData.login}`)
                .setLabel(`Watch ${streamData.user_name}`)
                .setStyle(ButtonStyle.Link)
        )
    return { embed, row };
}

async function updateStreamMessage(apiChannel, embed, client) {
    // try {
    const channel = await client.channels.fetch(client.config.channels.streamNotification);
    if (apiChannel.lastMessageId != null) {
        const message = await channel.messages.fetch(apiChannel.lastMessageId);
        if (message) {
            console.log("Edit Message");
            return await message.edit({ embeds: [embed.embed], components: [embed.row] });
        }
    }
    const newSendMmessage = await channel.send({ embeds: [embed.embed], components: [embed.row] });
    apiChannel.lastMessageId = newSendMmessage.id;
    await updateChannel(apiChannel.id, apiChannel);

    // } catch (error) {
    //     client.logger.error("Error while updateStreamMessage\n" + error)
    // }
}

module.exports = {
    startStreamNotificationInterval,
    streamNotification
}