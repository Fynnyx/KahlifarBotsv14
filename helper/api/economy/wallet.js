const axios = require('axios');
const { getDCUser } = require('./../dcuser.js');
const { getUser } = require('./../user.js');

async function getWalletByUserId(user, client) {
    if (user.discordId) {
        const dcuser = await getDCUser(user.discordId, client);
        return dcuser.user.economyInventory.wallet;
    } else if (user.userId) {
        const user = await getUser(user.userId, client);
        return user.economyInventory.wallet;
    } else {
        return false;
    }
}

async function updateWallet(wallet) {
    try {
        const updatedWallet = await axios.put(`${process.env.API_URL}/economy/wallets/${wallet.id}`, wallet);
        return updatedWallet.data;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    getWalletByUserId,
    updateWallet
}