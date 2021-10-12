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

    @Column("boolean")
    public enableAuditLog!: boolean;

    @Column("string")
    public prefix = botPrefix;

    @Column("string")
    public welcomeLogChannel!: Snowflake;

    @Column("boolean")
    public enableWelcomeLog!: boolean;

    @Column("string")
    public tempVoiceChannel!: Snowflake;

    @Column("boolean")
    public enableTempVoiceChannel!: boolean;

    @Column("string")
    public tempVoiceName = "{user.username} Voice";

    @Column("string")
    public muteRoleId!: Snowflake;

    @Column("string")
    public autoRoleId!: Snowflake;

    @Column("boolean")
    public enableAutoRole!: boolean;
}
