import { Snowflake } from "discord.js";
import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn } from "typeorm";

@Entity({ name: "warnCases" })
export class warnCases {
    @ObjectIdColumn()
    public _id!: ObjectID;

    @PrimaryColumn("string")
    public guild!: Snowflake;

    @Column("string")
    public modlogChannel!: Snowflake;

    @Column("string")
    public reason!: string;

    @Column("string")
    public warnCase!: string;

    @Column("string")
    public executorId!: string;

    @Column("string")
    public targetId!: Snowflake;

    @Column("string")
    public messageId!: Snowflake;
}
