const { loadCommands } = require('../../loader/commandHandler');
const { startStreamNotificationInterval } = require('../../helper/components/streamNotification');
const { startStatChannelUpdateInterval } = require('../../helper/components/statchannel');

module.exports = {
    name: 'ready',
    usage: 'ready',
    once: true,
    execute(client) {
        try {
            loadCommands(client)
            startStreamNotificationInterval(client)
            // startStatChannelUpdateInterval(client)
            console.info(`\x1b[33m${client.user.username}\x1b[34m, logged in\x1b[0m`)
            client.logger.info(`${client.user.username}, logged in`)
        } catch (error) {
            client.logger.error("Error while ready\n" + error)
        }
    },
};