const axios = require('axios');

async function getAllChannels() {
    try {
        const channels = await axios.get(`${process.env.API_URL}/twitchchannel`, {
            headers: {
                API_KEY: process.env.API_KEY
            },
        });
        return channels.data;
    } catch (error) {
        return {
            isError: true,
            message: error?.response?.data?.message
        };
    }
}

async function getChannelById(id) {
    try {
        const channel = await axios.get(`${process.env.API_URL}/twitchchannel/${id}`, {
            headers: {
                API_KEY: process.env.API_KEY
            }
        });
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
        const channel = await axios.get(`${process.env.API_URL}/twitchchannel/byName/${twitchName}`, {
            headers: {
                API_KEY: process.env.API_KEY
            }
        });
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
        const channel = await axios.post(`${process.env.API_URL}/twitchchannel`, channelData, {
            headers: {
                API_KEY: process.env.API_KEY
            }
        });
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
        const channel = await axios.put(`${process.env.API_URL}/twitchchannel/${id}`, channelData, {
            headers: {
                API_KEY: process.env.API_KEY
            },
            maxContentLength: 10000000000000,

        });
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
        await axios.delete(`${process.env.API_URL}/twitchchannel/${id}`, {
            headers: {
                API_KEY: process.env.API_KEY
            }
        });
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