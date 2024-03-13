import { SlashCommandBuilder } from "discord.js";

export class CustomCommand extends SlashCommandBuilder{
    developerOnly: boolean;
    execute: (...args: any[]) => void;
    constructor(developerOnly: boolean, data: SlashCommandBuilder, execute: (...args: any[]) => void) {
        super(data);
        this.developerOnly = developerOnly;
        this.execute = execute;
    }
}