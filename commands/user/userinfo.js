const {ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js');
const {getUser} = require('../../helper/api/user.js');
const {getDCUser} = require('../../helper/api/dcuser.js');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get all information about a user!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option.setName('user').setDescription('The user you want to see').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user');
        const apidcuser = await getDCUser(user.id);
        const member = interaction.guild.members.cache.get(user.id);
        const roles = member.roles.cache.map(role => role.toString()).join(' ');
        const userinfoEmbed = new EmbedBuilder()
            .setColor(member.accentColor || member.displayColor)
            .setTitle(`Userinfo of ${user.username}#${user.discriminator}`)
            .setThumbnail(user.displayAvatarURL())

        interaction.reply({embeds: [userinfoEmbed]})
    }
};

