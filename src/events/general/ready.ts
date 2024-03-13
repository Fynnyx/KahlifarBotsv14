import CustomClient from "@/types/CustomClient";
import { CustomEvent } from "@/types/CustomEvent";
import { ActivityType, Events } from "discord.js";

export default new CustomEvent(
    Events.ClientReady,
    "Once the bot is ready",
    true,
    (client: CustomClient<true>) => {
        console.info(`\x1b[33m${client.user.username}\x1b[34m, logged in\x1b[0m`)
        client.user.setActivity({name: "changes", type: ActivityType.Listening});
    }
);