const { kahlifarApiAxios } = require('../../../loader/axios');

async function getAllTopics(client) {
    try {
        const response = await kahlifarApiAxios.get(`${process.env.API_URL}/modmail/topics`)
        return response.data;
    } catch (error) {
        client.logger.error(error);
        return {
            isError: true,
            error: error?.response?.data?.message ? error.response.data.message : error.message
        }
    }
}

async function getTopic(topicId) {
    try {
        const response = await kahlifarApiAxios.get(`${process.env.API_URL}/modmail/topics/${topicId}`)
        return response.data;
    } catch (error) {
        client.logger.error(error);
        return {
            isError: true,
            error: error?.response?.data?.message ? error.response.data.message : error.message
        }
    }
}

module.exports = {
    getAllTopics,
    getTopic
}