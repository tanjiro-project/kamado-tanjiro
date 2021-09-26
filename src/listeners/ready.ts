import { Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import chalk from "chalk";
import { botActivity, botActivityType, botOwners } from "../config";
import { Team } from "discord.js";
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
        return this.container.logger.info(chalk.green(`[CLIENT]: ${this.container.client.user?.username.toUpperCase()} CONNECTED TO DISCORD`));
    }
}
