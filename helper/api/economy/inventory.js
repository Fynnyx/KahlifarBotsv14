const { kahlifarApiAxios } = require('../../../loader/axios');

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
        const newInventory = await kahlifarApiAxios.post(`${process.env.API_URL}/economy/inventories`, {
                wallet: {
                    id: walletId
                },
                user: {
                    id: userId
                }
            },
            {
                headers: {
                    API_KEY: process.env.API_KEY
                }
            });
        console.log(newInventory);
        return newInventory.data;
    } catch (error) {
        return {
            isError: true,
            message: error.response.data.message || error.message
        }
    }
}


module.exports = {
    getEconomyInventoryByUserId,
    createEconomyInventory
}