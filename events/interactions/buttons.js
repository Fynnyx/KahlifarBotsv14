const { ButtonInteraction } = require('discord.js');
const { sendSuccess, sendError } = require('../../helper/util/send');

module.exports = {
    name: 'interactionCreate',
    usage: 'buttons',
    /**
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {
        if (interaction.isButton()) {
            switch (interaction.customId) {
                case 'verify':
                    try {
                        await interaction.deferReply({ ephemeral: true })
                        return sendSuccess('Verified', 'You have been verified!', interaction, client)
                    }
                    catch (error) {
                        console.error(error)
                        return sendError('Error', 'Something went wrong while verifying you!', interaction, client)
                    }
            }
        }
    }
}