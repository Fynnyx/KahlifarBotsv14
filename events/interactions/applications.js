const { getApplicationById, updateApplication } = require("../../helper/api/application");
const { applicationAcceptByService } = require("../../helper/components/application/application");
const { sendError, sendSuccess } = require("../../helper/util/send");
const { getMainDCUser } = require("../../helper/api/dcuser")
const { logToModConsole } = require("../../helper/util/logToModConsole");


module.exports = {
    name: "interactionCreate",
    usage: "applications",
    async execute(interaction, client) {
        if (interaction.isButton()) {
            const guild = client.guilds.cache.get(client.config.guildId);
            switch (interaction.customId) {
                case 'modApplicationAccept':
                    try {
                        await interaction.deferReply({ ephemeral: true })
                        const application = await getApplicationById(interaction.message.embeds[0].footer.text)
                        if (application.isError) return sendError('Error', application.message, interaction, client)
                        if (!application.isOpen || application.isAccepted != null) return sendError('Error', 'This application is already closed/accepted!' , interaction, client)

                        const acceptReturn = await applicationAcceptByService(application, client)
                        if (acceptReturn?.isError) return sendError('Error', acceptReturn.message, interaction, client)

                        application.isOpen = false
                        application.isAccepted = true
                        const update = await updateApplication(application.id, application)
                        if (update.isError) return sendError('Error', update.message, interaction, client)
                        const member = await guild.members.fetch((await getMainDCUser(application.user.discordUsers)).discordId);
                        await member.send(`✅ - Your application \`#${application.id}\` has been accepted!`)
                        await sendSuccess('Application accepted', 'The application has been accepted!', interaction, client)
                        interaction.message.delete()
                        logToModConsole(`Application accepted`, `Application accepted by **${interaction.user.tag}** for **${application.serviceId}\`#${application.id}\`**`, client.config.colors.lightblue, client)
                    } catch (error) {
                        client.logger.error(error)
                        return sendError('Error', 'Something went wrong while accepting the application!', interaction, client)
                    }
                    break;
            }
        }
    }
}