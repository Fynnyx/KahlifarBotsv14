const { getDCUser, getMainDCUser } = require("../../api/dcuser");
const { createApplication, userHasDouplicates } = require("../../api/application");
const { checkUsername } = require("../../components/games/minecraft");

async function applicationSetup(discordId, serviceId, value) {
    const dcUser = await getDCUser(discordId);
    if (dcUser.isError) return dcUser;
    if (await userHasDouplicates(serviceId, value, discordId, true)) return { isError: true, message: 'You already have an (duplicate) application for this service!' };
    const applicationResponse = await createApplication({
        serviceId: serviceId,
        value: value,
        user: {
            id: dcUser.user.id
        },
    });
    if (applicationResponse.isError) return applicationResponse;
    return applicationResponse;
}

async function applicationAcceptByService(application, client) {
    try {
    const guild = client.guilds.cache.get(client.config.guildId);
    switch (application.serviceId) {
        case "MINECRAFT_KAHLIFAR":

            const  mckliUsernameCheck = await checkUsername(application.value, client);
            if (mckliUsernameCheck.isError) return mckliUsernameCheck;

            const mckliConsole = await client.channels.cache.get(client.config.channels.mckliConsole);
            await mckliConsole.send(`whitelist add ${application.value}`);

            const mckliRole = guild.roles.cache.get(client.config.roles.mckliMember);
            const mckliMember = await guild.members.fetch((await getMainDCUser(application.user.discordUsers)).discordId);
            await mckliMember.roles.add(mckliRole);
            return { isError: false, message: 'Application accepted!' };
    }
    } catch (error) {
        return { isError: true, message: error.message };
    }
}

module.exports = {
    applicationSetup,
    applicationAcceptByService
}