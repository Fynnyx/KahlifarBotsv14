import { CustomEvent } from "@/types/CustomEvent";
import { Events } from "discord.js";

export default new CustomEvent(
    Events.ClientReady,
    "Once the bot is ready",
    true,
    (client) => {
        console.info(`\x1b[33m${client.user.username}\x1b[34m, logged in\x1b[0m`)
        // client.user.setActivity("with code");
    }
);