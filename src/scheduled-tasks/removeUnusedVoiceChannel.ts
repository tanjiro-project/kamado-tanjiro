import { ApplyOptions } from "@sapphire/decorators";
import { ScheduledTask } from "@sapphire/plugin-scheduled-tasks";
import { Snowflake } from "discord.js";

@ApplyOptions<ScheduledTask.Options>({
    name: "removeUnusedVoiceChannel"
})

export class removeUnusedVoiceChannel extends ScheduledTask {
    public async run(payload: removeUnusedVoiceChannelPayload) {
        await this.container.client.databases.tempVoice.delete(payload.guildId, payload.channelId);
        await this.container.client.channels.cache.get(payload.channelId)?.delete();
    }
}

export interface removeUnusedVoiceChannelPayload {
    channelId: Snowflake;
    guildId: Snowflake;
    parentId: Snowflake;
}
