import dotenv from "dotenv";
import { loadEvents } from "@/loader/eventLoader";
import CustomClient from "@/types/CustomClient";
import { GatewayIntentBits, Partials } from "discord.js";

dotenv.config();

const { DISCORD_TOKEN } = process.env;

if (!DISCORD_TOKEN) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
};

const client = new CustomClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages],
  partials: [Partials.User, Partials.Message, Partials.GuildMember, Partials.ThreadMember],
});

loadEvents(client);

client.login(config.DISCORD_TOKEN);

export default client;