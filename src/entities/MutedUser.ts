import { Snowflake } from "discord.js";
import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn } from "typeorm";

@Entity({ name: "MutedUser" })
export class MutedUser {
    @ObjectIdColumn()
    public _id!: ObjectID;

    @PrimaryColumn("string")
    public guild!: Snowflake;

    @Column("string")
    public reason!: Snowflake;

    @Column("string")
    public targetId!: Snowflake;

    @Column("string")
    public executorId!: Snowflake;
}
