import { getMongoRepository, MongoRepository } from "typeorm";
import { Snowflake } from "discord.js";
import { GuildRole } from "../entities/GuildRole";

export class GuildRoleDatabaseManager {
    public repository!: MongoRepository<GuildRole>;
    public _initRepos() {
        this.repository = getMongoRepository(GuildRole);
    }

    public async get(guild: Snowflake, channelId: Snowflake, messageId: Snowflake, emojiIdOrName: string) {
        return this.repository.findOne({ guild, channelId, messageId, emojiIdOrName });
    }

    public async set(guild: Snowflake, roleId: Snowflake, channelId: Snowflake, messageId: Snowflake, key: keyof GuildRole, value: any): Promise<GuildRole> {
        const data = (await this.repository.findOne({ guild, roleId, channelId, messageId })) ?? this.repository.create({ guild, roleId, channelId, messageId });
        data[key] = value;
        await this.repository.save(data);
        return data;
    }
}
