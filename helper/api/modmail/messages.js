const axios = require('axios');

async function getAllMessages(client) {
    try {
        const response = await axios.get(`${process.env.API_URL}/modmail/messages`, {
            headers: {
                API_KEY: process.env.API_KEY
            }
        });
        return response.data;
    } catch (error) {
        client.logger.error(error);
        return {
            isError: true,
            message: error?.response?.data?.message
        }
    }
}

async function getMessageById(client, id) {
    try {
        const response = await axios.get(`${process.env.API_URL}/modmail/messages/${id}`, {
            headers: {
                API_KEY: process.env.API_KEY
            }
        });
        return response.data;
    } catch (error) {
        client.logger.error(error);
        return {
            isError: true,
            message: error?.response?.data?.message
        }
    }
}

async function createMessage(message, client) {
    try {
        const response = await axios.post(`${process.env.API_URL}/modmail/messages`, message, {
            headers: {
                API_KEY: process.env.API_KEY
            }
        });
        return response.data;
    } catch (error) {
        client.logger.error(error);
        return {
            isError: true,
            message: error?.response?.data?.message
        }
    }
}

async function updateMessage(messageId, message, client) {
    try {
        const response = await axios.put(`${process.env.API_URL}/modmail/messages/${messageId}`, message, {
            headers: {
                API_KEY: process.env.API_KEY
            }
        });
        return response.data;
    } catch (error) {
        client.logger.error(error);
        return {
            isError: true,
            message: error?.response?.data?.message
        }
    }
}

async function deleteMessage(messageId, client) {
    try {
        const response = await axios.delete(`${process.env.API_URL}/modmail/messages/${messageId}`, {
            headers: {
                API_KEY: process.env.API_KEY
            }
        });
        return response.data;
    } catch (error) {
        client.logger.error(error);
        return {
            isError: true,
            message: error?.response?.data?.message
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
