const { loadCommands } = require('../../loader/commandHandler');
const { startStreamNotificationInterval } = require('../../helper/components/streamNotification');
const { startStatChannelUpdateInterval } = require('../../helper/components/statchannel');
const { startJobs } = require('../../helper/components/jobs/start');
const { sendSuccess } = require('../../helper/util/send');
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    usage: 'ready',
    once: true,
    execute(client) {
        try {
            loadCommands(client)
            if (process.env.ENVIRONMENT == "prd") {
                startStreamNotificationInterval(client)
            }
            const jobCount = startJobs();
            // startStatChannelUpdateInterval(client)
            console.info(`\x1b[33m${client.user.username}\x1b[34m, logged in\x1b[0m`)
            client.logger.info(`${client.user.username}, logged in`)
            client.user.setActivity('to you and /help', { type: ActivityType.Listening })
            console.log(client.guilds.cache.size);
        } catch (error) {
            client.logger.error("Error while ready\n" + error)
        }
    },
};