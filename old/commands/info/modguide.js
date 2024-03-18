const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const { getCMSEmbed, createCMSEmbed } = require('../../helper/cms/embed');
const { sendError } = require('../../helper/util/send');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modguide')
        .setDescription('Get all information about beeing a moderator.'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const embedData = await getCMSEmbed('modguide')

        if (!embedData[0]) return sendError("An error occured", 'No embed found with that name!', interaction, client);

        interaction.reply({
            embeds: [
                await createCMSEmbed(embedData[0].attributes)
            ],
            ephemeral: true
        })
    }
}
