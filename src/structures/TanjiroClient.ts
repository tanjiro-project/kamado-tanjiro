import { SapphireClient, SapphireClientOptions } from "@sapphire/framework";
import { Intents } from "discord.js";
import { join } from "path";
import { Connection } from "typeorm";
import { botPrefix } from "../config";
import { GuildDatabaseManager } from "../databases/GuildDatabaseManager";

export class TanjiroClient extends SapphireClient {
    public constructor(clientOptions?: SapphireClientOptions) {
        super({
            allowedMentions: {
                users: [],
                repliedUser: false
            },
            baseUserDirectory: join(__dirname, ".."),
            caseInsensitiveCommands: true,
            caseInsensitivePrefixes: true,
            fetchPrefix: async (msg) => {
                return (await this.databases.guilds.get(msg.guildId!)).prefix
            },
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
            ...clientOptions
        });
    }
    public connection!: Connection;
    public databases = {
        guilds: new GuildDatabaseManager()
    }
}

declare module '@sapphire/framework' {
    export interface SapphireClient {
        databases: {
            guilds: GuildDatabaseManager
        }
        connection: Connection;
    }
}