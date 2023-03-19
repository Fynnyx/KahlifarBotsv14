const axios = require('axios');

async function getEconomyInventoryByUserId(user) {
    if (user.discordId) {
        const dcuser = await getDCUser(user.discordId);
        return dcuser.user.economyInventory;
    } else if (user.userId) {
        const user = await getUser(user.userId);
        return user.economyInventory;
    } else {
        return false;
    }
}

async function createEconomyInventory(walletId, userId) {
    try {
        console.log(walletId, userId);
        const newInventory = await axios.post(`${process.env.API_URL}/economy/inventories`, {
            wallet: {
                id: walletId
            },
            user: {
                id: userId
            }
        });
        return newInventory.data;
    } catch (error) {
        return {
            isError: true,
            message: error.response.data.message
        }
    }
}


module.exports = {
    getEconomyInventoryByUserId,
    createEconomyInventory
}