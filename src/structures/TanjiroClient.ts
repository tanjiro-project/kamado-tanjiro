import { SapphireClient, SapphireClientOptions } from "@sapphire/framework";
import { Intents } from "discord.js";
import { join } from "path";
import { Connection } from "typeorm";
import { GuildDatabaseManager } from "../databases/GuildDatabaseManager";
import { GuildRoleDatabaseManager } from "../databases/GuildRoleDatabaseManager";
import { MutedUserDatabaseManager } from "../databases/MutedUserDatabaseManager";
import { TempVoiceDatabaseManager } from "../databases/TemporaryChannelDatabaseManager";
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
            partials: ["GUILD_MEMBER", "REACTION", "MESSAGE"],
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
            typing: true,
            ...clientOptions
        });
    }

    public connection!: Connection;
    public databases = {
        guilds: new GuildDatabaseManager(),
        warn: new WarnDatabaseManager(),
        tempVoice: new TempVoiceDatabaseManager(),
        mutedUser: new MutedUserDatabaseManager(),
        guildRole: new GuildRoleDatabaseManager()
    };
}

declare module "@sapphire/framework" {
    export interface SapphireClient {
        databases: {
            guilds: GuildDatabaseManager;
            warn: WarnDatabaseManager;
            tempVoice: TempVoiceDatabaseManager;
            mutedUser: MutedUserDatabaseManager;
            guildRole: GuildRoleDatabaseManager;
        };
        connection: Connection;
    }
}
