const { SlashCommandBuilder, ChatCommandInteraction, EmbedBuilder } = require('discord.js');
const { Client } = require('discord.js');
const { getCMSSocials } = require('../../helper/cms/socials');
const { sendError } = require('../../helper/util/send');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('socials')
        .setDescription('Zeigt die Socials an')
        .addBooleanOption(option =>
            option
                .setName('description')
                .setDescription('Zeigt die Beschreibung an')
                .setRequired(false)
        ),
    /**
     * @param {ChatCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.deferReply();
        const description = interaction.options.getBoolean('description') || false;
        const socials = await getCMSSocials();
        if (!socials.data[0]) {
            return sendError("Error", "Es wurden keine Socials gefunden!", interaction, client);
        }

        const embed = new EmbedBuilder()
            .setTitle('Socials Media Kanäle')
            .setDescription('Hier findest du alle Socials Media Kanäle von uns\nFolge uns und bleibe auf dem Laufenden!')
            .setColor(client.config.colors.blue)
            .setTimestamp()
            .setFooter({
                text: `Socials von Kahlifar Netzwerk`,
                iconUrl: client.user.avatarURL()
            })
        for (const social of socials.data) {
            embed.addFields(
                {
                    name: social.attributes.Name,
                    value: `[${social.attributes.Username}](${social.attributes.URL})\n\n${description ? social.attributes.Description : ''}`,
                    inline: false
                }
            )
        }

        interaction.editReply({ embeds: [embed] });


    }
};
