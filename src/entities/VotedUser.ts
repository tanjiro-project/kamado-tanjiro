import { Snowflake } from "discord.js";
import { Entity, ObjectID, ObjectIdColumn, PrimaryColumn } from "typeorm";

@Entity({ name: "votedUser" })
export class VotedUser {
    @ObjectIdColumn()
    public _id!: ObjectID;

    @PrimaryColumn()
    public userId!: Snowflake;
}
