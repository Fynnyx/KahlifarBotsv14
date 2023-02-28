const { loadCommands } = require('../../loader/commandHandler');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        loadCommands(client)
        console.info(`\x1b[33m${client.user.username}\x1b[34m, logged in\x1b[0m`)
    },
};