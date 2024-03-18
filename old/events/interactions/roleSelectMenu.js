const { StringSelectMenuInteraction } = require('discord.js');
const { isRoleSelect } = require('../../helper/components/select');
const { sendSuccess } = require('../../helper/util/send');

module.exports = {
    name: 'interactionCreate',
    usage: 'selecMenus',
    /**
     * @param {StringSelectMenuInteraction} interaction
     */
    async execute(interaction, client) {
        if (interaction.isStringSelectMenu()) {
            if (isRoleSelect(interaction.customId)) {
                try {
                    await interaction.deferReply({ ephemeral: true })
                    const selected = interaction.values;
                    const update = {
                        added: [],
                        removed: []
                    }
                    for (const role of interaction.component.options) {
                        if (selected.includes(role.value)) continue;
                        let removerole = interaction.guild.roles.cache.get(role.value);
                        if (interaction.member.roles.cache.has(removerole.id)) {
                            interaction.member.roles.remove(removerole)
                            update.removed.push("`" + removerole.name + "`")
                        }
                    }
                    for (const role of selected) {
                        let addrole = interaction.guild.roles.cache.get(role);
                        if (!interaction.member.roles.cache.has(addrole.id)) {
                            interaction.member.roles.add(addrole)
                            update.added.push("`" + addrole.name + "`")
                        }
                    }
                    return sendSuccess('Roles updated', `Added roles: ${update.added.join(', ')}\nRemoved roles: ${update.removed.join(', ')}`, interaction, client)
                } catch (error) {

                }
            }
        }
    }
}
