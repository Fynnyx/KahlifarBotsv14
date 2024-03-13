import { Client, Collection } from "discord.js";
import { CustomEvent } from "./CustomEvent";
import { CustomCommand } from "./CustomCommand";

export default class CustomClient extends Client {
    config: object = {};
    events: Collection<string, CustomEvent> = new Collection();
    commands: Collection<string, CustomCommand> = new Collection();
}