const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getDCUser } = require('../../helper/api/dcuser.js');
const { addBalance, removeBalance, setBalance } = require('../../helper/api/economy/balance.js');
const { sendSuccess } = require('../../helper/util/send.js');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Get all information about a user!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addSubcommand(subcommand => subcommand
            .setName('add')
            .setDescription('Add coins and emeralds to a user\'s wallet')
            .addUserOption(option => option.setName('user').setDescription('The user you want to add coins and emeralds to').setRequired(true))
            .addIntegerOption(option => option.setName('coins').setDescription('The amount of coins you want to add').setRequired(true))
            .addIntegerOption(option => option.setName('emeralds').setDescription('The amount of emeralds you want to add').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('remove')
            .setDescription('Remove coins and emeralds from a user\'s wallet')
            .addUserOption(option => option.setName('user').setDescription('The user you want to remove coins and emeralds from').setRequired(true))
            .addIntegerOption(option => option.setName('coins').setDescription('The amount of coins you want to remove').setRequired(true))
            .addIntegerOption(option => option.setName('emeralds').setDescription('The amount of emeralds you want to remove').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('set')
            .setDescription('Set coins and emeralds to a user\'s wallet')
            .addUserOption(option => option.setName('user').setDescription('The user you want to set coins and emeralds to').setRequired(true))
            .addIntegerOption(option => option.setName('coins').setDescription('The amount of coins you want to set').setRequired(true))
            .addIntegerOption(option => option.setName('emeralds').setDescription('The amount of emeralds you want to set').setRequired(true))
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        subcommand = interaction.options.getSubcommand();

        const user = interaction.options.getUser('user');
        const coins = interaction.options.getInteger('coins');
        const emeralds = interaction.options.getInteger('emeralds');
        const apidcuser = await getDCUser(user.id, client);

        switch (subcommand) {
            case 'add':
                await addBalance({coins: coins, emeralds: emeralds}, apidcuser)
                sendSuccess(
                    "Balanced updated", 
                    `**Added** ${"`"}${coins}${"`"} coins and ${"`"}${emeralds}${"`"} emeralds to ${user}'s wallet!`, 
                    interaction, 
                    client);             
                break;
            case 'remove':
                await removeBalance({coins: coins, emeralds: emeralds}, apidcuser)
                sendSuccess(
                    "Balanced updated",
                    `**Removed** ${"`"}${coins}${"`"} coins and ${"`"}${emeralds}${"`"} emeralds from ${user}'s wallet!`,
                    interaction,
                    client);
                break;
            case 'set':
                await setBalance({coins: coins, emeralds: emeralds}, apidcuser)
                sendSuccess(
                    "Balanced updated",
                    `**Set** ${"`"}${coins}${"`"} coins and ${"`"}${emeralds}${"`"} emeralds to ${user}'s wallet!`,
                    interaction,
                    client);
                break;

        }
    }
};