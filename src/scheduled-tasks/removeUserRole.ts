import { ScheduledTask, ScheduledTaskOptions } from "@sapphire/plugin-scheduled-tasks";
import { ApplyOptions } from "@sapphire/decorators";
import { Snowflake } from "discord.js";

@ApplyOptions<ScheduledTaskOptions>({
    name: "removeUserRole"
})

export class removePrizeTask extends ScheduledTask {
    public async run(payload: removePrizeTaskPayload) {
        const guildCache = this.container.client.guilds.cache.get(payload.guildId);
        if (guildCache) {
            await (await guildCache.members.fetch(payload.userId).catch(() => undefined))?.roles.remove(payload.roleId).catch(() => undefined);
        }
    }
}

declare module "@sapphire/framework" {
    interface ScheduledTasks {
        removeUserRole: never;
    }
}

export interface removePrizeTaskPayload {
    userId: Snowflake;
    roleId: Snowflake;
    guildId: Snowflake;
}