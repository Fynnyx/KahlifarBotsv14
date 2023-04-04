const { SlashCommandBuilder, ChatCommandInteraction, EmbedBuilder } = require('discord.js');
const { Client } = require('discord.js');
const { sendError } = require('../../helper/util/send');
const { getCMSEmbed, createCMSEmbed } = require('../../helper/cms/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Generelle Informationen über den Bot'),
    /**
     * @param {ChatCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.deferReply();
        const infoData = await getCMSEmbed('info');
        if (!infoData[0]) {
            return sendError("Error", "Es wurden keine info Data gefunden!", interaction, client);
        }
        const embed = await createCMSEmbed(infoData[0].attributes);

        embed.setFooter({
            text: `© ${client.user.username} | ${client.user.id}`,
            iconURL: client.user.avatarURL()
        });
        embed.setTimestamp();

        embed.addFields({
            name: 'Ping',
            value: `${client.ws.ping}ms`,
            inline: true
        },
        );

        interaction.editReply({ embeds: [embed] });


    }
};
