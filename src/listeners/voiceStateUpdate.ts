import { Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { VoiceState } from "discord.js";
import { Util } from "../Util";
@ApplyOptions<ListenerOptions>({
    name: "voiceStateUpdate"
})

export class readyEvent extends Listener {
    async run(oldState: VoiceState, newState: VoiceState) {
        const guildDatabases = await this.container.client.databases.guilds.get(oldState.guild.id ?? newState.guild.id);
        const getOldTemporaryChannelDatabase = await this.container.client.databases.tempVoice.get(oldState?.guild.id, oldState.channelId!);
        const getNewTemporaryChannelDatabase = await this.container.client.databases.tempVoice.get(newState?.guild.id, newState.channelId!);
        if (guildDatabases && guildDatabases.enableTempVoiceChannel) {
            const parentTempVoice = this.container.client.channels.resolve(guildDatabases.tempVoiceChannel);
            if (getNewTemporaryChannelDatabase && newState.channelId === getNewTemporaryChannelDatabase.channelId) {
                const timeoutCache = this.container.client.databases.tempVoice.cache.get(newState.channelId);
                if (timeoutCache) clearTimeout(timeoutCache);
            }
            if (parentTempVoice && parentTempVoice.isVoice()) {
                if (newState.channelId && newState.channelId === guildDatabases.tempVoiceChannel) {
                    const TemporaryChannelDatabase = await this.container.client.databases.tempVoice.getUserVoice(newState.guild.id, newState.member?.id!);
                    if (TemporaryChannelDatabase) {
                        if (!this.container.client.channels.cache.has(TemporaryChannelDatabase.channelId)) {
                            await newState.member?.voice.setChannel(guildDatabases.tempVoiceChannel);
                            return this.container.client.databases.tempVoice.delete(TemporaryChannelDatabase.guild, TemporaryChannelDatabase.channelId);
                        }
                        const timeoutCache = this.container.client.databases.tempVoice.cache.get(TemporaryChannelDatabase.channelId);
                        if (timeoutCache) clearTimeout(timeoutCache);
                        return newState.member?.voice.setChannel(TemporaryChannelDatabase.channelId).catch(() => null);
                    }
                    if (!newState.channel) return;
                    const createdTemporaryChannel = await newState.guild.channels.create(Util.parseChannelName(guildDatabases.tempVoiceName, newState.member?.user), {
                        type: "GUILD_VOICE",
                        parent: newState.channel?.parentId!
                    });
                    await createdTemporaryChannel.permissionOverwrites.edit(newState.member!, {
                        MANAGE_CHANNELS: true
                    });
                    await this.container.client.databases.tempVoice.set(newState.guild.id, createdTemporaryChannel.id, newState.member?.id!, "parentId", createdTemporaryChannel.parentId);
                    newState.member?.voice.setChannel(createdTemporaryChannel).catch(() => null);
                } else if (oldState.channelId === getOldTemporaryChannelDatabase?.channelId && !oldState.channel?.members.size) {
                    const voiceTimeout = setTimeout(async () => {
                        await this.container.client.channels.resolve(oldState.channelId!)?.delete();
                        await this.container.client.databases.tempVoice.delete(oldState.guild.id, oldState.channelId!);
                        this.container.client.databases.tempVoice.cache.delete(oldState.channelId!);
                    }, 5000);
                    this.container.client.databases.tempVoice.cache.set(oldState.channelId, voiceTimeout);
                }
            }
        }
    }
}
