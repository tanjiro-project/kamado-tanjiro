import { Snowflake } from "discord.js";
import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn } from "typeorm";

@Entity({ name: "GuildRole" })
export class GuildRole {
    @ObjectIdColumn()
    public _id!: ObjectID;

    @PrimaryColumn("string")
    public guild!: Snowflake;

    @Column("string")
    public roleId!: Snowflake;

    @Column("string")
    public channelId!: Snowflake;

    @Column("string")
    public messageId!: Snowflake;

    @Column("string")
    public emojiIdOrName!: string;
}
