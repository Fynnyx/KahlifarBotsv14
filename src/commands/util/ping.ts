import CustomClient from "@/types/CustomClient";
import { CustomCommand } from "@/types/CustomCommand";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default new CustomCommand(
    false, 
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get the bots\'s ping'),
    (interaction: ChatInputCommandInteraction, client: CustomClient<true>) => {
        interaction.reply({ content: `**${client.ws.ping}**ms`, ephemeral: true });
    }
)