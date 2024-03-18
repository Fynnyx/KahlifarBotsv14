const { kahlifarApiAxios } = require('../../../loader/axios');

async function getAllMessages(client) {
    try {
        const response = await kahlifarApiAxios.get(`${process.env.API_URL}/modmail/messages`);
        return response.data;
    } catch (error) {
        client.logger.error(error);
        return {
            isError: true,
            message: error?.response?.data?.message ? error.response.data.message : error.message
        }
    }
}

async function getMessageById(client, id) {
    try {
        const response = await kahlifarApiAxios.get(`${process.env.API_URL}/modmail/messages/${id}`);
        return response.data;
    } catch (error) {
        client.logger.error(error);
        return {
            isError: true,
            message: error?.response?.data?.message ? error.response.data.message : error.message
        }
    }
}

async function createMessage(message, client) {
    try {
        const response = await kahlifarApiAxios.post(`${process.env.API_URL}/modmail/messages`, message);
        return response.data;
    } catch (error) {
        client.logger.error(error);
        return {
            isError: true,
            message: error?.response?.data?.message ? error.response.data.message : error.message
        }
    }
}

async function updateMessage(messageId, message, client) {
    try {
        const response = await kahlifarApiAxios.put(`${process.env.API_URL}/modmail/messages/${messageId}`, message);
        return response.data;
    } catch (error) {
        client.logger.error(error);
        return {
            isError: true,
            message: error?.response?.data?.message ? error.response.data.message : error.message
        }
    }
}

async function deleteMessage(messageId, client) {
    try {
        const response = await kahlifarApiAxios.delete(`${process.env.API_URL}/modmail/messages/${messageId}`);
        return response.data;
    } catch (error) {
        client.logger.error(error);
        return {
            isError: true,
            message: error?.response?.data?.message ? error.response.data.message : error.message
        }
    }
}

module.exports = {
    getAllMessages,
    getMessageById,
    createMessage,
    updateMessage,
    deleteMessage
}
