import { getMongoRepository, MongoRepository } from "typeorm";
import { Snowflake } from "discord.js";
import { warnCases } from "../entities/WarnCases";

export class WarnDatabaseManager {
    public repository!: MongoRepository<warnCases>;
    public _initRepos() {
        this.repository = getMongoRepository(warnCases);
    }

    public async get(guild: Snowflake, warnCase: string): Promise<warnCases | undefined> {
        const data = await this.repository.findOne({ guild, warnCase });
        return data;
    }

    public async set(guild: Snowflake, warnCase: string, executorId: string, targetId: string, messageId: Snowflake, modlogChannel: Snowflake, key: keyof warnCases, value: any): Promise<warnCases> {
        const data = (await this.repository.findOne({ guild, warnCase, executorId, targetId, messageId, modlogChannel })) ?? this.repository.create({ guild, warnCase, executorId, targetId, messageId, modlogChannel });
        data[key] = value;
        await this.repository.save(data);
        return data;
    }

    public async updateReasonCase(guild: Snowflake, warnCase: string, reason: string) {
        const data = await this.get(guild, warnCase);
        data!.reason = reason;
        await this.repository.save(data!);
        return data;
    }

    public async deleteCase(guild: Snowflake, warnCase: string) {
        const data = await this.repository.deleteOne({
            guild, warnCase
        });
        return data;
    }
}
