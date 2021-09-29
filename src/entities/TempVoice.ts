import { Snowflake } from "discord.js";
import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn } from "typeorm";

@Entity({ name: "tempVoices" })
export class TempVoice {
    @ObjectIdColumn()
    public _id!: ObjectID;

    @PrimaryColumn("string")
    public guild!: Snowflake;

    @Column("string")
    public parentId!: Snowflake;

    @Column("string")
    public ownerId!: Snowflake;

    @Column("string")
    public channelId!: Snowflake;
}
