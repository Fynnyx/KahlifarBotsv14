const { ButtonBuilder, ActionRowBuilder } = require('discord.js')

async function disableButton(interaction, customId = undefined) {
    const components = []
    for (const actionRow of interaction.components) {
        const newActionRow = new ActionRowBuilder()
        for (const component of actionRow.components) {
            if (!customId || component.customId == customId) {
                const newButton = ButtonBuilder.from(component.data).setDisabled(true)
                newActionRow.addComponents(newButton)
            }
        }
        components.push(newActionRow)
    }
    await interaction.edit({ components: components })
    return components
}

async function enableButton(interaction, customId = undefined) {
    const components = []
    for (const actionRow of interaction.components) {
        const newActionRow = new ActionRowBuilder()
        for (const component of actionRow.components) {
            if (!customId || component.customId == customId) {
                const newButton = ButtonBuilder.from(component.data).setDisabled(false)
                newActionRow.addComponents(newButton)
            }
        }
        components.push(newActionRow)
    }
    await interaction.edit({ components: components })
    return components
}

module.exports = {
    disableButton,
    enableButton
}