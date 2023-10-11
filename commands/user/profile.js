const { ChatInputCommandInteraction, Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const moment = require('moment');
const { getDCUser } = require('../../helper/api/dcuser');
const { updateUser } = require('../../helper/api/user');
const { sendError, sendSuccess } = require('../../helper/util/send');
const { cli } = require('winston-levelonly');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Get all information about a user!')
        .setNameLocalizations({
            'de': 'profil'
        })
        .addSubcommand(subcommand => subcommand
            .setName('get')
            .setDescription('Get all information about a user!')
            .addUserOption(option => option.setName('user').setDescription('The user you want to get information about').setRequired(false))
        )
        .addSubcommandGroup(subcommandgroup => subcommandgroup
            .setName('set')
            .setDescription('Set information about a user!')
            .addSubcommand(subcommand => subcommand
                .setName('birthday')
                .setDescription('Set a user\'s birthday.Format: DD.MM.YYYY')
                .addStringOption(option => option.setName('birthday').setDescription('The birthday you want to set').setRequired(true))
                .addUserOption(option => option.setName('user').setDescription('The user you want to set the birthday of').setRequired(false))
            )
            .addSubcommand(subcommand => subcommand
                .setName('email')
                .setDescription('Set a user\'s email.')
                .addStringOption(option => option.setName('email').setDescription('The email you want to set').setRequired(true))
                .addUserOption(option => option.setName('user').setDescription('The user you want to set the email of').setRequired(false))
            )
        ),

    /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
    async execute(interaction, client) {
        try {
            await interaction.deferReply({ ephemeral: true });
            subcommand = interaction.options.getSubcommand();
            subcommandgroup = interaction.options.getSubcommandGroup();
            let member = interaction.options.getMember('user');
            let user = member?.user;
            if (!user) {
                user = interaction.user;
                member = interaction.member;
            }

            switch (subcommand) {
                case 'get':
                    // Get user information
                    const apiUser = await getDCUser(user.id);

                    const roles = member.roles.cache.sort((a, b) => b.position - a.position)

                    let roleString = "<@&" + roles.map(r => r.id).join(">,\n<@&") + ">"
                    let permissionString = member.permissions.toArray().sort().join(",\n")

                    const userEmbed = new EmbedBuilder()
                        .setTitle(`User information for ${user.username}`)
                        .setColor(user.accentColor || member.displayColor)
                        .setThumbnail(user.displayAvatarURL())
                        .addFields(
                            {
                                name: "ID",
                                value: member.id,
                                inline: true
                            },
                            {
                                name: "Nickname",
                                value: member.nickname || "*No nickname*",
                                inline: true
                            },
                            {
                                name: "Top Color",
                                value: `${member.displayHexColor}`,
                                inline: true
                            },
                            {
                                name: "First joined",
                                value: `${moment(apiUser.firstJoinDate).format('DD.MM.YYYY')}`,
                                inline: true
                            },
                            {
                                name: "Last joined",
                                value: `${moment(member.joinedAt).format('DD.MM.YYYY')}`,
                                inline: true
                            },
                            {
                                name: "Created at",
                                value: `${moment(user.createdAt).format('DD.MM.YYYY')}`,
                                inline: true
                            },
                            {
                                name: "Nitro Booster since",
                                value: member.premiumSince ? `${moment(user.premiumSince).format('DD.MM.YYYY')}` : "*No booster*",
                                inline: true
                            })
                    if (interaction.member.permissions.has(PermissionFlagsBits.Administrator) || interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers) || interaction.user.id === user.id) {

                        userEmbed
                            .setDescription(` \
                **Birthday:**  ${apiUser.user.birthday ? moment(apiUser.user.birthday).format('DD.MM.YYYY') : "*No birthday*"} \n \
                **Email:**  ${apiUser.user.email ? apiUser.user.email : "*No email*"} \n \
                **Service Applications:** Open \`${apiUser.user.applications.filter(app => app.isOpen).length}\` / Rejected \`${apiUser.user.applications.filter(app => !app.isOpen && !app.isAccepted).length}\` / Accepted \`${apiUser.user.applications.filter(app => app.isAccepted).length}\` \n \
                `)
                            .addFields(
                                {
                                    name: "- Bot's Permissions on User -",
                                    value: "\u200b",
                                    inline: false
                                },
                                {
                                    name: "Bot",
                                    value: user.bot ? "Yes" : "No",
                                    inline: true
                                },
                                {
                                    name: "Kickable",
                                    value: member.kickable ? "Yes" : "No",
                                    inline: true
                                },
                                {
                                    name: "Bannable",
                                    value: member.bannable ? "Yes" : "No",
                                    inline: true
                                },
                                {
                                    name: "Manageable",
                                    value: member.managed ? "Yes" : "No",
                                    inline: true
                                },
                                {
                                    name: "Moderatable",
                                    value: member.hoist ? "Yes" : "No",
                                    inline: true
                                },
                                {
                                    name: "\u200b",
                                    value: "**`- Roles & Permissions -`**",
                                    inline: false
                                },
                                {
                                    name: `Roles (${member.roles.cache.size})`,
                                    value: roleString,
                                    inline: true
                                },
                                {
                                    name: "Permissions",
                                    value: permissionString,
                                    inline: true
                                }
                            )

                    } else {
                        userEmbed
                            .setDescription("***Note!** This is not all data. Due to privacy rules in place, we do not share all of the data provided by our services or Discord.*")
                            .addFields(
                                {
                                    name: "\u200b",
                                    value: "**`- Roles -`**",
                                    inline: false
                                },
                                {
                                    name: `Roles (${member.roles.cache.size})`,
                                    value: roleString,
                                    inline: true
                                }
                            )
                    }
                    interaction.editReply({ embeds: [userEmbed] });
                    break;
            }
            switch (subcommandgroup) {
                case 'set':
                    let apiUser
                    let apiUserReturn
                    if (user && !(interaction.user.id == user.id || interaction.member.permissions.has(PermissionFlagsBits.Administrator) || interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers))) {
                        return sendError("User not updated", 'You do not have the permission to update other users!', interaction, client);
                    }
                    switch (subcommand) {
                        case 'birthday':
                            const birthday = interaction.options.getString('birthday');
                            // Check if birthday is valid
                            const birthdayDate = moment(birthday, 'DD.MM.YYYY');
                            if (!birthdayDate.isValid()) {
                                return sendError("User not updated", 'The format of the birthday you provided is not valid!', interaction, client);
                            }
                            // Check if birthday is in the past
                            if (birthdayDate.isAfter(moment())) {
                                return sendError("User not updated", 'The birthday you provided is in the future!', interaction, client);
                            }
                            apiUser = await getDCUser(user.id);
                            apiUser.user.birthday = moment(birthdayDate).format('YYYY-MM-DD');
                            apiUserReturn = await updateUser(apiUser.user.id, apiUser.user);
                            if (apiUserReturn.isError) {
                                await sendError(
                                    "Error while updating user",
                                    apiUserReturn.message,
                                    interaction,
                                    client
                                )
                                return
                            }

                            await sendSuccess(title = "User updated", description = `The birthday of **${user.username}** has been set to \`${birthdayDate.format('DD.MM.YYYY')}\`!`, message = interaction, client = client);
                            break;

                        case 'email':
                            const email = interaction.options.getString('email');
                            // Check if email is valid with regex
                            if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                                return sendError("User not updated", 'The email you provided is not valid!', interaction, client);
                            }
                            apiUser = await getDCUser(user.id);
                            apiUser.user.email = email;
                            apiUserReturn = await updateUser(apiUser.user.id, apiUser.user);
                            if (apiUserReturn.isError) {
                                await sendError(
                                    "Error while updating user",
                                    apiUserReturn.message,
                                    interaction,
                                    client
                                )
                                return
                            }
                            await sendSuccess(title = "User updated", description = `The email of **${user.username}** has been set to \`${email}\`!`, message = interaction, client = client);
                            break;
                    }
                    break;
            }
            // interaction.editReply({ content: 'This command is still in development!' });
        } catch (error) {
            client.logger.error(error);
            await sendError(
                "Error while executing command",
                error.message,
                interaction,
                client
            )
        }
    }
}