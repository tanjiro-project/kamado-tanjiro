import { getMongoRepository, MongoRepository } from "typeorm";
import { Snowflake } from "discord.js";
import { TempVoice } from "../entities/TempVoice";

export class TempVoiceDatabaseManager {
    public repository!: MongoRepository<TempVoice>;
    public _initRepos() {
        this.repository = getMongoRepository(TempVoice);
    }

    public async get(guild: Snowflake, channelId: Snowflake): Promise<TempVoice | undefined> {
        const data = await this.repository.findOne({ guild, channelId });
        return data;
    }

    public async getUserVoice(guild: Snowflake, ownerId: Snowflake): Promise<TempVoice | undefined> {
        const data = await this.repository.findOne({ guild, ownerId });
        return data;
    }

    public async set(guild: Snowflake, channelId: Snowflake, ownerId: Snowflake, key: keyof TempVoice, value: any): Promise<TempVoice> {
        const data = await this.repository.findOne({ guild, channelId, ownerId }) ?? this.repository.create({ guild, ownerId, channelId });
        data[key] = value;
        await this.repository.save(data);
        return data;
    }

    public async setTaskId(guild: Snowflake, channelId: Snowflake, taskId: string) {
        return this.repository.findOneAndUpdate({ guild, channelId }, { $set: { taskId } }, { upsert: false });
    }

    public async delete(guild: Snowflake, channelId: Snowflake) {
        const data = await this.repository.deleteOne({
            guild, channelId
        });
        return data;
    }
}
