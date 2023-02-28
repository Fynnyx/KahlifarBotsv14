const { updateWallet } = require ('./wallet.js');

async function addBalance(balance, dcuser) {
    dcuser.user.economyInventory.wallet.coins += balance.coins;
    dcuser.user.economyInventory.wallet.emeralds += balance.emeralds;
    return await updateWallet(dcuser.user.economyInventory.wallet);
}

async function removeBalance(balance, dcuser) {
    dcuser.user.economyInventory.wallet.coins -= balance.coins;
    dcuser.user.economyInventory.wallet.emeralds -= balance.emeralds;
    return await updateWallet(dcuser.user.economyInventory.wallet);
}

async function setBalance(balance, dcuser) {
    dcuser.user.economyInventory.wallet.coins = balance.coins;
    dcuser.user.economyInventory.wallet.emeralds = balance.emeralds;
    return await updateWallet(dcuser.user.economyInventory.wallet);
}

module.exports = {
    addBalance,
    removeBalance,
    setBalance
}