import { getMongoRepository, MongoRepository } from "typeorm";
import { Snowflake } from "discord.js";
import { VotedUser } from "../entities/VotedUser";

export class VotedUserDatabaseManager {
    public repository!: MongoRepository<VotedUser>;
    public _initRepos() {
        this.repository = getMongoRepository(VotedUser);
    }

    public async get(userId: Snowflake): Promise<VotedUser | undefined> {
        const data = await this.repository.findOne({ userId });
        return data;
    }

    public async set(userId: Snowflake): Promise<VotedUser> {
        const data = (await this.repository.findOne({ userId })) ?? this.repository.create({ userId });
        await this.repository.save(data);
        return data;
    }

    public async delete(userId: Snowflake) {
        const data = await this.repository.deleteOne({ userId });
        return data;
    }
}
