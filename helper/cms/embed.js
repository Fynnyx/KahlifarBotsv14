const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

async function getCMSEmbed(name) {
    const embed = await axios.get(`${process.env.CMS_URL}/embeds?populate=*&filters[Name][$eq]=${name}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.CMS_TOKEN}`
            }
        }
    );
    return embed.data.data;
}

async function createCMSEmbed(data) {
    const embed = new EmbedBuilder()
        .setTitle(data.Title)
        .setDescription(data.Description)
        .setColor(data.Color)


    for (const field of data.fields) {
        embed.addFields({
            name: field.Name,
            value: field.Value,
            inline: field.Inline
        })
    }
    return embed;
}

module.exports = {
    getCMSEmbed,
    createCMSEmbed
}

