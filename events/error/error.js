const { loadCommands } = require('../../loader/commandHandler');
const { startStreamNotificationInterval } = require('../../helper/components/streamNotification');
const { startStatChannelUpdateInterval } = require('../../helper/components/statchannel');
const { startJobs } = require('../../helper/components/jobs/start');
const { sendSuccess } = require('../../helper/util/send');
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'error',
    usage: 'error',
    execute(client, error) {
        console.log(error);
        try {
            client.logger.error(error)
        } catch (error) {
            client.logger.error(error)
        }
    },
};