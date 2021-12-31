import { Snowflake } from "discord.js";
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity({ name: "votedUser" })
export class VotedUser {
    @ObjectIdColumn()
    public _id!: ObjectID;

    @Column()
    public userId!: Snowflake;
}
