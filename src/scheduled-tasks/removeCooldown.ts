import { ScheduledTask, ScheduledTaskOptions } from "@sapphire/plugin-scheduled-tasks";
import { ApplyOptions } from "@sapphire/decorators";
import { Snowflake } from "discord.js";

@ApplyOptions<ScheduledTaskOptions>({
    name: "removeCooldown"
})

export class removePrizeTask extends ScheduledTask {
    public async run(payload: removeCooldownPayload) {
        this.container.client.cooldownVote.delete(payload.userId);
    }
}

declare module "@sapphire/framework" {
    interface ScheduledTasks {
        removeCooldown: never;
    }
}

export interface removeCooldownPayload {
    userId: Snowflake;
}
