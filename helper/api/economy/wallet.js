const axios = require('axios');
const { getDCUser } = require('./../dcuser.js');
const { getUser } = require('./../user.js');

async function getWalletByUserId(user) {
    if (user.discordId) {
        const dcuser = await getDCUser(user.discordId);
        return dcuser.user.economyInventory.wallet;
    } else if (user.userId) {
        const user = await getUser(user.userId);
        return user.economyInventory.wallet;
    } else {
        return false;
    }
}

async function createWallet(balance = { coins: 0, emeralds: 0 }) {
    try {
        const wallet = await axios.post(`${process.env.API_URL}/economy/wallets`, balance);
        return wallet.data;
    } catch (error) {
        return {
            isError: true,
            message: error.response.data.message
        }
    }
}

async function updateWallet(wallet) {
    try {
        const updatedWallet = await axios.put(`${process.env.API_URL}/economy/wallets/${wallet.id}`, wallet);
        return updatedWallet.data;
    } catch (error) {
        return false;
    }
}

module.exports = {
    getWalletByUserId,
    createWallet,
    updateWallet
}