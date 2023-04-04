const axios = require('axios');

async function getConversation(conversationId, client) {
    try {
        const response = await axios.get(`${process.env.API_URL}/modmail/conversations/${conversationId}`, {
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

async function createConversation(conversation, client) {
    try {
        const response = await axios.post(`${process.env.API_URL}/modmail/conversations`, conversation, {
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

async function updateConversation(conversationId, conversation, client) {
    try {
        const response = await axios.put(`${process.env.API_URL}/modmail/conversations/${conversationId}`, conversation, {
            headers: {
                API_KEY: process.env.API_KEY
            }
        })
        return response.data;
    } catch (error) {
        console.error(error);
        client.logger.error(error);
        return {
            isError: true,
            error: error?.response?.data?.message
        }
    }
}

async function deleteConversation(conversationId, client) {
    try {
        const response = await axios.delete(`${process.env.API_URL}/modmail/conversations/${conversationId}`, {
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
    getConversation,
    createConversation,
    updateConversation,
    deleteConversation
}