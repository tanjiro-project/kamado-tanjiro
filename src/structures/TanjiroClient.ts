import { SapphireClient, SapphireClientOptions } from "@sapphire/framework";
import { Intents } from "discord.js";
import { join } from "path";
import { GuildDatabaseManager } from "../databases/GuildDatabaseManager";
import { GuildRoleDatabaseManager } from "../databases/GuildRoleDatabaseManager";
import { MutedUserDatabaseManager } from "../databases/MutedUserDatabaseManager";
import { TempVoiceDatabaseManager } from "../databases/TemporaryChannelDatabaseManager";
import { WarnDatabaseManager } from "../databases/WarnDatabaseManager";

import { ScheduledTaskRedisStrategy } from "@sapphire/plugin-scheduled-tasks/register-redis";
import "@sapphire/plugin-hmr/register";
import { TagDatabaseManager } from "../databases/TagDatabaseManager";

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
            tasks: {
                strategy: new ScheduledTaskRedisStrategy({
                    bull: {
                        redis: {
                            host: process.env.REDIS_HOST,
                            port: parseInt(process.env.REDIS_PORT!),
                            password: process.env.REDIS_PASSWORD,
                            username: process.env.REDIS_USERNAME
                        },
                        defaultJobOptions: {
                            attempts: 3,
                            removeOnComplete: true,
                            removeOnFail: true
                        }
                    }
                })
            },
            ...clientOptions
        });
    }

    public databases = {
        guilds: new GuildDatabaseManager(),
        warn: new WarnDatabaseManager(),
        tempVoice: new TempVoiceDatabaseManager(),
        mutedUser: new MutedUserDatabaseManager(),
        guildRole: new GuildRoleDatabaseManager(),
        tag: new TagDatabaseManager()
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
            tag: TagDatabaseManager;
        };
    }
}
