import { getMongoRepository, MongoRepository } from "typeorm";
import { Collection, Snowflake } from "discord.js";
import { MutedUser } from "../entities/MutedUser";

export class MutedUserDatabaseManager {
    public repository!: MongoRepository<MutedUser>;
    public _initRepos() {
        this.repository = getMongoRepository(MutedUser);
    }

    public async get(guild: Snowflake, targetId: Snowflake): Promise<MutedUser | undefined> {
        const data = await this.repository.findOne({ guild, targetId });
        return data;
    }

    public cache: Collection<Snowflake, NodeJS.Timeout> = new Collection();

    public async set(guild: Snowflake, targetId: Snowflake, key: keyof MutedUser, value: any): Promise<MutedUser> {
        const data = (await this.repository.findOne({ guild, targetId })) ?? this.repository.create({ guild, targetId });
        // @ts-ignore
        data[key] = value;
        await this.repository.save(data);
        return data;
    }

    public async delete(guild: Snowflake, targetId: Snowflake) {
        const data = await this.repository.deleteOne({
            guild, targetId
        });
        return data;
    }
}
