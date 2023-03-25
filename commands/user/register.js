const { SlashCommandBuilder, PermissionFlagsBits, GuildMember } = require('discord.js');
const { registerNewUser } = require('../../helper/api/register.js');
const { registerDCUser } = require('../../helper/api/dcuser.js');
const { sendSuccess, sendError } = require('../../helper/util/send.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register a user to the database!')
        .addUserOption(option => option.setName('user').setDescription('The user you want to register').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        const newMemberReturn = await registerNewUser(member);
        if (newMemberReturn == true) {
            await sendSuccess(
                "User registered",
                `**Registered** ${user} to the database!`,
                interaction,
                client);
        } else {
            await sendError(
                "An error occured",
                newMemberReturn,
                interaction,
                client);
        }

    }
};
