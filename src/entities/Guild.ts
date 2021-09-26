import { Snowflake } from "discord.js";
import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn } from "typeorm";
import { botPrefix } from "../config";

@Entity({ name: "guilds" })
export class Guild {
    @ObjectIdColumn()
    public _id!: ObjectID;

    @PrimaryColumn("string")
    public guild!: Snowflake;

    @Column("string")
    public modlogChannel!: Snowflake;

    @Column("boolean")
    public enableModLog!: boolean;

    @Column("string")
    public auditLogChannel!: Snowflake;

    @Column("string")
    public enableAuditLog!: Snowflake;

    @Column("string")
    public prefix = botPrefix;
}
