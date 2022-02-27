import { Snowflake } from "discord.js";
import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn } from "typeorm";

@Entity({ name: "tag" })
export class Tag {
    @ObjectIdColumn()
    public _id!: ObjectID;

    @PrimaryColumn("string")
    public name!: string;

    @PrimaryColumn("string")
    public authorId!: Snowflake;

    @PrimaryColumn("string")
    public guild!: Snowflake;

    @Column("string")
    public content!: string;
}
