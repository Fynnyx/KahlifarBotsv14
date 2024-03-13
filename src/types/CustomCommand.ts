import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import CustomClient from "./CustomClient";

export class CustomCommand{
    developerOnly: boolean;
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction, client: CustomClient<true>) => void;
    constructor(developerOnly: boolean, data: SlashCommandBuilder, execute: (...args: any[]) => void) {
        this.developerOnly = developerOnly;
        this.data = data;
        this.execute = execute;
    }
}