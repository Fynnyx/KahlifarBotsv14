const { ButtonInteraction, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { sendSuccess, sendError } = require('../../helper/util/send');
const { randomAddSub } = require('../../helper/components/verify');
const { getCMSCollection } = require('../../helper/cms/collection');
const { sleep } = require('../../helper/util/sleep');

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
                        const randomCalc = randomAddSub()
                        const select = new StringSelectMenuBuilder()
                            .setCustomId('verify-capcha')
                            .setPlaceholder('Select the correct answer')
                        for (const answer of randomCalc.answers) {
                            select.addOptions({
                                label: answer.toString(),
                                value: answer.toString()
                            })
                        }
                        const row = new ActionRowBuilder()
                            .addComponents(
                                select
                            )
                        await interaction.editReply({ content: `To verify you are not a botted user. Select the right answer too the question below!\n\nWhat is **${randomCalc.calculation}**?`, components: [row] })
                        // Wait for the user to select the right answer
                        const filter = i => i.customId === 'verify-capcha' && i.user.id === interaction.user.id
                        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30 * 1000 })
                        let answered = false
                        collector.on('collect', async i => {
                            if (i.values[0] == randomCalc.result) {
                                answered = true
                                const collectionData = await getCMSCollection("verifyRoles")
                                if (!collectionData.data[0]) return sendError('Error', 'Something went wrong while verifying you!', interaction, client)
                                const roles = collectionData.data[0].attributes.values
                                const member = interaction.member
                                for (const roleObject of roles) {
                                    const role = interaction.guild.roles.cache.find(r => r.id === roleObject.value)
                                    if (!role) continue
                                    if (member.roles.cache.has(role.id)) continue
                                    await member.roles.add(role)
                                }
                                sendSuccess('Verified', '**You have been verified!**', interaction, client)
                                const memberRole = interaction.guild.roles.cache.find(r => r.id === client.config.roles.member)
                                if (!memberRole) return sendError('Error', 'Something went wrong while verifying you!', interaction, client)
                                await sleep(2.5)
                                await member.roles.add(memberRole)
                                return 
                            } else {
                                answered = true
                                return sendError('Error', 'You have selected the wrong answer!\nRepress the button!', interaction, client)
                            }
                        })
                        collector.on('end', async () => {
                            // interaction.editReply({content: null, components: []})
                            if (!answered)
                                return sendError('Error', 'You took to long to answer the question!\nRepress the button!', interaction, client)
                        })


                    }catch (error) {
                        client.logger.error(error)
                        return sendError('Error', 'Something went wrong while verifying you!', interaction, client)
                    }
            }
        }
    }
}