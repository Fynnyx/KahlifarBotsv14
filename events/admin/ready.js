const { loadCommands } = require('../../loader/commandHandler');
const { startStreamNotificationInterval } = require('../../helper/components/streamNotification');
const { startStatChannelUpdateInterval } = require('../../helper/components/statchannel');
const { ActivityType } = require('discord.js');

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

            client.user.setActivity('to you and /help', { type: ActivityType.Listening })
        } catch (error) {
            client.logger.error("Error while ready\n" + error)
        }
    },
};