const axios = require('axios');
const client = require('../../index.js');

async function getDCUser(discordId, client) {
    const user = await axios.get(`${process.env.API_URL}/dcusers/byDiscordId/${discordId}`);
    return user.data;
}

module.exports = {
    getDCUser
}