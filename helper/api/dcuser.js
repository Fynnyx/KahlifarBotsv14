const axios = require('axios');
const client = require('../../index.js');

async function getDCUser(discordId) {
    const user = await axios.get(`${process.env.API_URL}/dcusers/byDiscordId/${discordId}`);
    return user.data;
}

async function registerDCUser(dcuser) {
    try {
        const newDCUser = await axios.post(`${process.env.API_URL}/dcusers`, dcuser);
        return newDCUser.data;
    } catch (error) {
        return {
            isError: true,
            message: error.response.data.message 
        };
    }
}

module.exports = {
    getDCUser,
    registerDCUser
}