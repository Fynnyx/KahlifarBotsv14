const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getWalletByUserId } = require('../../helper/api/economy/wallet.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('wallet')
        .setDescription('Get all information about your or other wallets!')
        .addUserOption(option => option.setName('user').setDescription('The user\'s wallet you want to see')),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user') || interaction.user;

        const wallet = await getWalletByUserId(
            {
                discordId: user.id
            },
            client
        );
        const walletEmbed = new EmbedBuilder()
        .setColor(client.config.colors.lightblue)
        .setTitle(`Wallet of ${user.username}`)
        .setDescription('Coins and Emeralds can be used to buy items in the shop!')
        .setThumbnail(user.displayAvatarURL())
        .addFields(
            {
                name: 'Coins',
                value: `${wallet.coins}`,
                inline: true
            },
            {
                name: 'Emeralds',
                value: `${wallet.emeralds}`,
                inline: true
            }
        )
        .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp()

        interaction.reply({embeds: [walletEmbed]})
    }
};