const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChatInputCommandInteraction, Client, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { sendError } = require('../../helper/util/send');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Role Manager')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ModerateMembers)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Adds a role to members of a role')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to add')
                        .setRequired(true)
                )
                .addRoleOption(option =>
                    option.setName('targetrole')
                        .setDescription('The role to add the role to')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Removes a role from members of a role')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to remove')
                        .setRequired(true)
                )
                .addRoleOption(option =>
                    option.setName('targetrole')
                        .setDescription('The role to remove the role from')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Shows information about a role')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to show information about')
                        .setRequired(true)
                )
        ),
    /**
     * @param { ChatInputCommandInteraction } interaction
     * @param { Client } client
     */
    async execute(interaction, client) {
        try {
            switch (interaction.options.getSubcommand()) {
                case 'add':
                    await interaction.deferReply({ ephemeral: true });
                    const roleToAdd = interaction.options.getRole('role');
                    const targetRole = interaction.options.getRole('targetrole');

                    const guildMembers = await interaction.guild.members.fetch();
                    const members = guildMembers.filter(member => member.roles.cache.has(targetRole.id));
                    await interaction.editReply(`Adding ${roleToAdd} to ${members.size} members of ${targetRole}`);

                    let summary = {
                        membersAdded: 0,
                        membersSkipped: 0,
                    }

                    members.forEach(member => {
                        console.log(member.user.username);
                        if (member.roles.cache.has(roleToAdd.id)) return summary.membersSkipped++;
                        member.roles.add(roleToAdd);
                        summary.membersAdded++;
                    });

                    const addSummary =  new EmbedBuilder()
                        .setTitle('Role Add Summary')
                        .setDescription(`Added ${roleToAdd} to members of ${targetRole}\n\`${summary.membersAdded}\` added\n\`${summary.membersSkipped}\` members skipped`)
                        .setColor(client.config.colors.success)
                        .setTimestamp();

                    await interaction.editReply({ embeds: [addSummary], content: null });
                    break;
                case 'remove':
                    await interaction.deferReply({ ephemeral: true });
                    const roleToRemove = interaction.options.getRole('role');
                    const targetRoleToRemove = interaction.options.getRole('targetrole');

                    const guildMembersToRemove = await interaction.guild.members.fetch();
                    const membersToRemove = guildMembersToRemove.filter(member => member.roles.cache.has(targetRoleToRemove.id));

                    await interaction.editReply(`Removing ${roleToRemove} from ${membersToRemove.size} members of ${targetRoleToRemove}`);

                    let removeSummary = {
                        membersRemoved: 0,
                        membersSkipped: 0,
                    }

                    membersToRemove.forEach(member => {
                        if (!member.roles.cache.has(roleToRemove.id)) return removeSummary.membersSkipped++;
                        member.roles.remove(roleToRemove);
                        removeSummary.membersRemoved++;
                    });

                    const removeSummaryEmbed = new EmbedBuilder()
                        .setTitle('Role Remove Summary')
                        .setDescription(`Removed ${roleToRemove} from members of ${targetRoleToRemove}\n\`${removeSummary.membersRemoved}\` removed\n\`${removeSummary.membersSkipped}\` members skipped`)
                        .setColor(client.config.colors.success)

                    await interaction.editReply({ embeds: [removeSummaryEmbed], content: null });
                    break;
                case 'info':
                    await interaction.deferReply({ ephemeral: true });
                    const roleInfo = interaction.options.getRole('role');

                    // Fetch members
                    const guildMembersInfo = await interaction.guild.members.fetch();
                    roleInfo.members = guildMembersInfo.filter(member => member.roles.cache.has(roleInfo.id));

                    const roleInfoEmbed = new EmbedBuilder()
                        .setTitle(`Role Info - ${roleInfo.name}`)
                        .setDescription(`${roleInfo}`)
                        .setColor(roleInfo.color)
                        .setThumbnail(roleInfo.iconURL({ dynamic: true }))
                        .addFields(
                            { name: 'ID', value: roleInfo.id, inline: true },
                            { name: 'Members', value: roleInfo.members.size.toString(), inline: true },
                            { name: 'Color', value: roleInfo.hexColor, inline: true },
                            { name: 'Created', value: moment(new Date(roleInfo.createdAt)).format("Do MMMM YYYY"), inline: true },
                            { name: 'Position', value: roleInfo.position.toString(), inline: true },

                            { name: '\u200B', value: '\u200B' },

                            { name: 'Mentionable', value: roleInfo.mentionable ? 'Yes' : 'No', inline: true },
                            { name: 'Managed', value: roleInfo.managed ? 'Yes' : 'No', inline: true },
                            { name: 'Hoisted', value: roleInfo.hoist ? 'Yes' : 'No', inline: true },

                            { name: '\u200B', value: '\u200B' },

                            { name: 'Members', value: (roleInfo.members.size <= 20 ? (roleInfo.members.size == 0 ? "*No member has this role at the moment*" : roleInfo.members.map(member => member).join('\n')) : "*To many members to display!*"), inline: true },
                            { name: 'Permissions', value: roleInfo.permissions.toArray().length == 0 ? "*No permissions set*" : roleInfo.permissions.toArray().join('\n'), inline: true }
                        )
                        .setTimestamp();

                    await interaction.editReply({ embeds: [roleInfoEmbed], content: null });
                }

        } catch (error) {
            client.logger.error(error);
            await sendError(undefined, error, interaction, client);
        }
    }
}