const { kahlifarApiAxios } = require('../../loader/axios');

async function getAllChannels() {
    try {
        const channels = await kahlifarApiAxios.get(`${process.env.API_URL}/twitchchannel`, {
        });
        return channels.data;
    } catch (error) {
        return {
            isError: true,
            message: error?.response?.data?.message ? error.response.data.message : error.message
        };
    }
}

async function getChannelById(id) {
    try {
        const channel = await kahlifarApiAxios.get(`${process.env.API_URL}/twitchchannel/${id}`);
        return channel.data;
    } catch (error) {
        return {
            isError: true,
            message: error?.response?.data?.message ? error.response.data.message : error.message
        };
    }
}

async function getChannelByTwitchName(twitchName) {
    try {
        const channel = await kahlifarApiAxios.get(`${process.env.API_URL}/twitchchannel/byName/${twitchName}`);
        return channel.data;
    } catch (error) {
        return {
            isError: true,
            message: error?.response?.data?.message ? error.response.data.message : error.message
        };
    }
}

async function createChannel(channelData) {
    try {
        const channel = await kahlifarApiAxios.post(`${process.env.API_URL}/twitchchannel`, channelData);
        return channel.data;
    } catch (error) {
        return {
            isError: true,
            message: error?.response?.data?.message ? error.response.data.message : error.message
        };
    }
}

async function updateChannel(id, channelData) {
    try {
        const channel = await kahlifarApiAxios.put(`${process.env.API_URL}/twitchchannel/${id}`, channelData, {
        });
        return channel.data;
    } catch (error) {
        return {
            isError: true,
            message: error?.response?.data?.message ? error.response.data.message : error.message
        };
    }
}

async function deleteChannel(id) {
    try {
        await kahlifarApiAxios.delete(`${process.env.API_URL}/twitchchannel/${id}`);
    } catch (error) {
        return {
            isError: true,
            message: error?.response?.data?.message ? error.response.data.message : error.message
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