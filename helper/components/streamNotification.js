const moment = require("moment");
const axios = require("axios");
const { getChannelByTwitchName, updateChannel, getAllChannels } = require("../../helper/api/streamer");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getMainDCUser } = require("../api/dcuser");

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
            await streamNotification(channel.twitchName, client);
        }

    }, client.config.helpers.streamNotification.interval * 1000 * 60);
}

async function streamNotification(name, client) {
    try {
        if (name == "test") return
        requestData.headers.Authorization = `Bearer ${await getOAuthToken(client)}`;
        const apiStream = await getChannelByTwitchName(name);
        if (apiStream.isError) {
            return client.logger.error(`Error while streamNotification\nWith Streamer ${name}\n` + apiStream.message)
        }

        if (!await channelIsLive(name, client)) return
        const streamData = await getStreamData(name, client);
        if (!streamData) return

        const channelData = await getChannelData(name, client);
        const followerData = await getFollowerData(streamData.user_id, client);

        const embed = await createStreamEmbed(apiStream, streamData, channelData, followerData, client);

        if (apiStream.lastStreamId == streamData.id) {
            await updateStreamMessage(apiStream, embed, client);
        } else {
            const channel = await client.channels.fetch(client.config.channels.streamNotification);
            const message = await channel.send({ content: embed.content, embeds: [embed.embed], components: [embed.row] });
            apiStream.lastStreamId = streamData.id;
            apiStream.lastMessageId = message.id;
            const update = await updateChannel(apiStream.id, apiStream);
        }
    } catch (error) {
        client.logger.error(`Error while streamNotification\nWith Streamer ${name}\n` + error)
    }
}


// Auth
async function getOAuthToken(client) {
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
async function channelIsLive(name, client) {
    try {
        const { data } = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${name}`, requestData);
        return data.data.length > 0;
    } catch (error) {
        client.logger.error("Error while channelIsLive\n" + error)
    }
}

// Get Data
async function getChannelData(name, client) {
    try {
        const { data } = await axios.get(`https://api.twitch.tv/helix/users?login=${name}`, requestData);
        return data.data[0];
    } catch (error) {
        client.logger.error("Error while getChannelData\n" + error)
    }
}

async function getStreamData(name, client) {
    try {
        const { data } = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${name}`, requestData);
        return data.data[0];
    } catch (error) {
        client.logger.error("Error while getStreamData\n" + error)
    }
}

async function getFollowerData(streamerId, client) {
    try {
        const { data } = await axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${streamerId}`, requestData);
        return data;
    } catch (error) {
        client.logger.error("Error while getFollowerData\n" + error)
    }
}

// Embed
async function createStreamEmbed(apiChannel, streamData, channelData, followerData, client) {
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
    const content = `${apiChannel.doPing ? `<@&${client.config.helpers.streamNotification.pingRole}>,` : ""} **${apiChannel.user ? `<@${(await getMainDCUser(apiChannel?.user?.discordUsers)).discordId}>` : streamData.user_name}** is live now!`
    return { embed, row, content };
}

async function updateStreamMessage(apiChannel, embed, client) {
    try {
        const channel = await client.channels.fetch(client.config.channels.streamNotification);
        if (apiChannel.lastMessageId != null) {
            try {
                channel.messages.fetch(apiChannel.lastMessageId)
                    .then(async message => {
                        return await message.edit({ content: embed.content, embeds: [embed.embed], components: [embed.row] });
                    })
                    .catch(async error => {
                        const newSendMmessage = await channel.send({ content: embed.content, embeds: [embed.embed], components: [embed.row] });
                        apiChannel.lastMessageId = newSendMmessage.id;
                        await updateChannel(apiChannel.id, apiChannel);
                    })
            } catch (error) {
                client.logger.error("Error while updateStreamMessage\n" + error)
            }
        }


    } catch (error) {
        client.logger.error("Error while updateStreamMessage\n" + error)
    }
}

module.exports = {
    startStreamNotificationInterval,
    streamNotification
}