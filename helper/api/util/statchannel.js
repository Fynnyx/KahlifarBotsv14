const {kahlifarApiAxios} = require('../../../loader/axios')

async function getAllStatChannel() {
    try {
        const response = await kahlifarApiAxios.get(`${process.env.API_URL}/statchannel`)
        return response.data
    } catch (e) {
        return { isError: true, message: e.message }
    }
}

async function getStatChannelById(id) {
    try {
        const response = await kahlifarApiAxios.get(`/statchannel/${id}`)
        return response.data
    } catch (e) {
        return { isError: true, message: e.message }
    }
}

async function createStatChannel(statChannel) {
    try {
        const response = await kahlifarApiAxios.post(`/statchannel`, statChannel)
        return response.data
    } catch (e) {
        return { isError: true, message: e.message }
    }
}

async function updateStatChannel(id, statChannel) {
    try {
        const response = await kahlifarApiAxios.put(`/statchannel/${id}`, statChannel)
        return response.data
    } catch (e) {
        return { isError: true, message: e.message }
    }
}

async function deleteStatChannel(id) {
    try {
        const response = await kahlifarApiAxios.delete(`/statchannel/${id}`)
        return response.data
    } catch (e) {
        return { isError: true, message: e.message }
    }
}

module.exports = {
    getAllStatChannel,
    getStatChannelById,
    createStatChannel,
    updateStatChannel,
    deleteStatChannel
}