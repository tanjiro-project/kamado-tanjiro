import { Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { GuildMember, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../config";
@ApplyOptions<ListenerOptions>({
    name: "guildMemberAdd"
})

export class guildMemberAddEvent extends Listener {
    async run(member: GuildMember) {
        const guildDatabases = await this.container.client.databases.guilds.get(member.guild.id);
        const getMutedUser = await this.container.client.databases.mutedUser.get(member.guild.id!, member.id);
        if (getMutedUser) {
            await member.roles.add(guildDatabases.muteRoleId, getMutedUser.reason).catch(() => undefined);
            if ((guildDatabases.modlogChannel && guildDatabases.enableModLog) || member.guild.systemChannel) {
                const channel = this.container.client.channels.resolve(guildDatabases.modlogChannel ?? member.guild.systemChannel);
                if (channel && channel.isText()) {
                    await channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`⚠ | ${member.user.username} was muted, but i've handled them: [\`MUTED\`]`)
                                .setColor(botEmbedColor)
                        ]
                    });
                }
            }
        }
        if (guildDatabases.enableAutoRole) await member.roles.add(guildDatabases.autoRoleId, "Auto role").catch(() => undefined);
        if (guildDatabases.enableWelcomeLog) {
            const welcomeLogChannel = this.container.client.channels.resolve(guildDatabases.welcomeLogChannel);
            if (welcomeLogChannel && welcomeLogChannel.isText()) {
                welcomeLogChannel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`🍵 | Everyone welcome ${member.user.tag} to the server!`)
                            .setColor(botEmbedColor)
                    ]
                });
            }
        }
    }
}
