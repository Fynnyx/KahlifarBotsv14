const { kahlifarApiAxios } = require('../../loader/axios');
const client = require('../../index.js');

async function getDCUser(discordId) {
    try {
        const user = await kahlifarApiAxios.get(`/dcusers/byDiscordId/${discordId}`, {
        });
        return user.data;
    } catch (error) {
        return {
            isError: true,
            message: error?.response?.data?.message ? error.response.data.message : error.message
        };
    }
}

async function registerDCUser(dcuser) {
    try {
        const newDCUser = await kahlifarApiAxios.post(`/dcusers`, dcuser);
        return newDCUser.data;
    } catch (error) {
        return {
            isError: true,
            message: error?.response?.data?.message ? error.response.data.message : error.message
        };
    }
}

async function updateDCUser(dcuserId, dcuser) {
    try {
        const updatedDCUser = await kahlifarApiAxios.put(`${process.env.API_URL}/dcusers/${dcuserId}`, dcuser);
        return updatedDCUser.data;
    } catch (error) {
        return {
            isError: true,
            message: error?.response?.data?.message ? error.response.data.message : error.message
        };
    }
}

async function getMainDCUser(discordUsers) {
    for (const user of discordUsers) {
        if (user.isMainUser) {
            return user;
        }
    }
}

module.exports = {
    getDCUser,
    registerDCUser,
    getMainDCUser,
    updateDCUser
}