const axios = require('axios');

async function getAllTopics(client) {
    try {
        const response = await axios.get(`${process.env.API_URL}/modmail/topics`, {
            headers: {
                API_KEY: process.env.API_KEY
            }
        })
        return response.data;
    } catch (error) {
        client.logger.error(error);
        return {
            isError: true,
            error: error?.response?.data?.message
        }
    }
}

async function getTopic(topicId) {
    try {
        const response = await axios.get(`${process.env.API_URL}/modmail/topics/${topicId}`, {
            headers: {
                API_KEY: process.env.API_KEY
            }
        })
        return response.data;
    } catch (error) {
        client.logger.error(error);
        return {
            isError: true,
            error: error?.response?.data?.message
        }
    }
}

module.exports = {
    getAllTopics,
    getTopic
}