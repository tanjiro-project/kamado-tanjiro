import { SapphireClient, SapphireClientOptions } from "@sapphire/framework";
import { Intents } from "discord.js";
import { join } from "path";
import { Connection } from "typeorm";
import { GuildDatabaseManager } from "../databases/GuildDatabaseManager";
import { WarnDatabaseManager } from "../databases/WarnDatabaseManager";

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
            fetchPrefix: async msg => (await this.databases.guilds.get(msg.guildId!)).prefix,
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
            typing: true,
            ...clientOptions
        });
    }

    public connection!: Connection;
    public databases = {
        guilds: new GuildDatabaseManager(),
        warn: new WarnDatabaseManager()
    }
}

declare module "@sapphire/framework" {
    export interface SapphireClient {
        databases: {
            guilds: GuildDatabaseManager,
            warn: WarnDatabaseManager
        }
        connection: Connection;
    }
}
