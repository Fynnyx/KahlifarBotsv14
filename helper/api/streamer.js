const axios = require('axios');

async function getAllChannels() {
    const channels = await axios.get(`${process.env.API_URL}/twitchchannel`);
    return channels.data;
}

async function getChannelById(id) {
    try {
        const channel = await axios.get(`${process.env.API_URL}/twitchchannel/${id}`);
        return channel.data;
    } catch (error) {
        return {
            isError: true,
            message: error.response.data.message
        };
    }
}

async function getChannelByTwitchName(twitchName) {
    try {
        const channel = await axios.get(`${process.env.API_URL}/twitchchannel/byName/${twitchName}`);
        return channel.data;
    } catch (error) {
        return {
            isError: true,
            message: error.response.data.message
        };
    }
}

async function createChannel(channelData) {
    try {
        const channel = await axios.post(`${process.env.API_URL}/twitchchannel`, channelData);
        return channel.data;
    } catch (error) {
        return {
            isError: true,
            message: error.response.data.message
        };
    }
}

async function updateChannel(id, channelData) {
    try {
        const channel = await axios.put(`${process.env.API_URL}/twitchchannel/${id}`, channelData);
        return channel.data;
    } catch (error) {
        return {
            isError: true,
            message: error.response.data.message
        };
    }
}

async function deleteChannel(id) {
    try {
        console.log(id);
        await axios.delete(`${process.env.API_URL}/twitchchannel/${id}`);
    } catch (error) {
        return {
            isError: true,
            message: error.response.data.message
        };
    }
}

module.exports = {
    getAllChannels,
    getChannelById,
    getChannelByTwitchName,
    createChannel,
    updateChannel,
    deleteChannel
}