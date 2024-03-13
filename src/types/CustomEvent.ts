import { Events } from "discord.js";
import CustomClient from "./CustomClient";

export class CustomEvent {
    name: Events;
    usage: string = "";
    once: boolean = false;
    execute: (client: CustomClient, ...args: any[]) => void;
    constructor(name: Events, usage: string, once: boolean, execute: (...args: any[]) => void) {
        this.name = name;
        this.usage = usage;
        this.once = once;
        this.execute = execute;
    }
}