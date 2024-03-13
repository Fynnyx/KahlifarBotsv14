import CustomClient from "@/types/CustomClient";
import { CustomEvent } from "@/types/CustomEvent";
import { ChatInputApplicationCommandData, ChatInputCommandInteraction, Events, Interaction } from "discord.js";

export default new CustomEvent(
    Events.InteractionCreate,
    "When a user interacts with a command",
    false,
    (client: CustomClient<true>, interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
);