const { registerUser } = require('./user.js');
const { registerDCUser } = require('./dcuser.js');
const { createWallet } = require('./economy/wallet.js');
const { createEconomyInventory } = require('./economy/inventory.js');

async function registerNewUser(member) {
    const newUser = await registerUser(member.user.username);
    if (newUser.isError) return newUser.message;

    const newDCUser = await registerDCUser(
        {
            firstJoinDate: member.joinedTimestamp,
            lastJoinDate: member.joinedTimestamp,
            discordId: member.id,
            user: {
                id: newUser.id
            },
        });
    if (newDCUser.isError) return newDCUser.message;

    const newWallet = await createWallet({
        coins: 0,
        emeralds: 0
    });
    if (newWallet.isError) return newWallet.message;
    const newEconomyInventory = await createEconomyInventory(newWallet.id, newUser.id)
    if (newEconomyInventory.isError) return newEconomyInventory.message;
    return true;
}

module.exports = {
    registerNewUser
}