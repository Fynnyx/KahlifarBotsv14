const cron = require('node-cron');
const { client } = require('../../../index');
const { getMainDCUser } = require('../../api/dcuser');
const { searchBirthday } = require('../../api/user');
const { logToModConsole } = require('../../util/logToModConsole')

const birthdayTask = cron.schedule('0 1,13 * * * ', async () => {
    try {
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth() + 1;

        client.logger.info("BirthdayCron: Checking for " + currentDay + "." + currentMonth);
        const users = await searchBirthday(currentDay, currentMonth);
        if (users?.isError) {
            return client.logger.error(users.message);
        }
        for (let user of users) {
            let mainDcUser = await getMainDCUser(user.discordUsers)
            let member = await client.guilds.cache.get(client.config.guildId).members.fetch(mainDcUser.discordId);
            const year = new Date().getFullYear() - new Date(user.birthday).getFullYear();
            await logToModConsole("Birthday today", `Today is **${member.displayName}'s** birthday! This is the \`${year}\`. year!`, client.config.colors.lightblue, client);
        }
    } catch (err) {
        client.logger.error("BirthdayCron: " + err);
    }
},
    {
        scheduled: true,
        timezone: "Europe/Zurich"
    })


// Export
module.exports = { birthdayTask };