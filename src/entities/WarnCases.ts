import { Snowflake } from "discord.js";
import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn } from "typeorm";

@Entity({ name: "warnCases" })
export class Guild {
    @ObjectIdColumn()
    public _id!: ObjectID;

    @PrimaryColumn("string")
    public guild!: Snowflake;

    @Column("string")
    public modlogChannel!: Snowflake;

    @Column("string")
    public reason!: string;

    @Column("string")
    public warnId!: string;

    @Column("string")
    public executorId!: string

    @Column("string")
    public targetId!: string
}
