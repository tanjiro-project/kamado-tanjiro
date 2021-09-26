import { Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import chalk from "chalk";
import { botActivity, botActivityType, botOwners } from "../config";
import { Team } from "discord.js";
import { resolve } from "path";
import { createConnection } from "typeorm";
@ApplyOptions<ListenerOptions>({
    name: "ready",
    once: true
})

export class readyEvent extends Listener {
    async run() {
        this.container.client.user?.setActivity({
            name: botActivity,
            type: botActivityType
        });
        const developerId = await this.container.client.application?.fetch();
        if (developerId?.owner instanceof Team) {
            for (const [ownerId] of developerId?.owner.members) {
                if (!botOwners.includes(ownerId)) botOwners.push(ownerId);
                continue;
            }
        } else if (!botOwners.includes(developerId?.owner?.id!)) { botOwners.push(developerId?.owner?.id!); }
        this.container.client.connection = await createConnection({
            database: "tanjiroDatabases",
            entities: [`${resolve(__dirname, "..", "entities")}/**/*.ts`, `${resolve(__dirname, "..", "entities")}/**/*.js`],
            type: "mongodb",
            url: process.env.DATABASE!,
            useUnifiedTopology: true
        }).catch((e: any) => {
            this.container.logger.error("MONGODB_CONN_ERR:", e);
            this.container.logger.warn("Couldn't connect to database. Exiting...");
            return process.exit(1);
        }).then(async (c: any) => {
            this.container.logger.info("Connected to MongoDB cloud");
            for (const database of Object.values(this.container.client.databases)) {
                database._initRepos();
                continue;
            }
            return c;
        });


        return this.container.logger.info(chalk.green(`[CLIENT]: ${this.container.client.user?.username.toUpperCase()} CONNECTED TO DISCORD`));
    }
}
