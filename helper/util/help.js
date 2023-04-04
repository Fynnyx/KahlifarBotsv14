const { EmbedBuilder } = require('discord.js');

async function createHelpEmbed(client, command) {
    let embed = new EmbedBuilder()
        .setTitle(`Help for ${command.data.name}`)
        .setDescription(command.data.description)
        .setColor(client.config.colors.skyblue);
    
    let optionsString = await createCommandOptionsString(client, command.data.options);
    
    embed.addFields(
        { name: 'Options', value: optionsString, inline: true }
    );
    return embed;
}

async function createCommandOptionsString(client, options, indent=0) {
    let embedString = '';
    const indetString = indent == 0 ? '' : '‎ '.repeat(indent * 4);
    for (const option of options) {
        if (option.options) {
            embedString += indetString + `**${option.name}** - ${option.description}\n`;
            embedString += await createCommandOptionsString(client, option.options, indent + 1);
            continue;
        }

        embedString += indetString + `   \`${option.name}\` - ${option.description}\n`;
    }
    return embedString+'\n';
}

module.exports = {
    createHelpEmbed,
    createCommandOptionsString
}