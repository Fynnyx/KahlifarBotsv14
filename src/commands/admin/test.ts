import CustomClient from "@/types/CustomClient";
import { CustomCommand } from "@/types/CustomCommand";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default new CustomCommand(
    true,
    new SlashCommandBuilder()
        .setName("test")
        .setDescription("A test command"),
    (interaction: ChatInputCommandInteraction, client: CustomClient<true>) => {
        interaction.reply({ content: "Test command!", ephemeral: true });
    }
);
