import { ActivityType } from "discord.js";
export const botOwners: string[] = JSON.parse(process.env.OWNERS!);
export const botPrefix = process.env.PREFIX || "t!";
export const botActivity = process.env.ACTIVITY || "For demons";
export const botEmbedColor = "#A7D129";
export const botActivityType: ActivityType = (process.env.ACTIVITY_TYPE as ActivityType | undefined) || "WATCHING";
