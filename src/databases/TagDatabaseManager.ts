import { getMongoRepository, MongoRepository } from "typeorm";
import { Collection, Snowflake } from "discord.js";
import { Tag } from "../entities/Tag";

export class TagDatabaseManager {
    public repository!: MongoRepository<Tag>;
    public _initRepos() {
        this.repository = getMongoRepository(Tag);
    }

    public async get(guild: Snowflake, authorId: Snowflake, name: string): Promise<Tag | undefined> {
        const data = await this.repository.findOne({ guild, authorId, name });
        return data;
    }

    public cache: Collection<Snowflake, NodeJS.Timeout> = new Collection();

    public async create(guild: Snowflake, authorId: Snowflake, options: { name: string; content: string }): Promise<Tag> {
        const data = await this.repository.findOne({ guild, name: options.name }) ?? this.repository.create({ guild, name: options.name });
        data.authorId = authorId;
        data.content = options.content;
        await this.repository.save(data);
        return data;
    }

    public async find(guild: Snowflake, name: string): Promise<Tag | undefined> {
        const data = await this.repository.findOne({ guild, name });
        return data;
    }

    public async update(guild: Snowflake, name: string, content: string): Promise<Tag | undefined> {
        const data = await this.repository.findOne({ guild, name });
        if (data) {
            data.content = content;
            await this.repository.save(data);
            return data;
        }
        return data;
    }

    public async findAll(guild: Snowflake): Promise<Tag[]> {
        const data = await this.repository.find({ guild });
        return data;
    }

    public async delete(guild: Snowflake, authorId: Snowflake, name: string) {
        const data = await this.repository.deleteOne({ guild, authorId, name });
        return data;
    }
}
