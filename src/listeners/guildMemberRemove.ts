import { Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { GuildMember, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../config";
@ApplyOptions<ListenerOptions>({
    name: "guildMemberRemove"
})

export class guildMemberRemoveEvent extends Listener {
    async run(member: GuildMember) {
        const guildDatabases = await this.container.client.databases.guilds.get(member.guild.id);
        if (guildDatabases.enableWelcomeLog) {
            const welcomeLogChannel = this.container.client.channels.resolve(guildDatabases.welcomeLogChannel);
            if (welcomeLogChannel && welcomeLogChannel.isText()) {
                const awaitedMessage = await welcomeLogChannel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`🍞 | Looks like ${member.user.tag} not our member again!`)
                            .setColor(botEmbedColor)
                    ]
                });
                if (guildDatabases.enableAutoBan) {
                    if (guildDatabases.enableModLog) {
                        const modLogChannel = member.guild.channels.resolve(guildDatabases.modlogChannel);
                        if (modLogChannel?.isText()) {
                            await modLogChannel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .addField("**User**", `${member.id} | ${member.user.tag}`)
                                        .addField("**Executor**", `${member.guild.me?.user.id} | ${member.guild.me?.user.tag}`)
                                        .addField("**Timestamp**", `<t:${Date.now() / 1000 | 0}>`)
                                        .setThumbnail(member.displayAvatarURL())
                                        .setAuthor("BANNED", member.user.displayAvatarURL())
                                        .addField("**Reason**", "Auto ban: user leaving")
                                        .setColor(botEmbedColor)
                                ]
                            });
                        }
                    }
                    await member.guild.members.ban(member, { reason: "Auto ban: user leaving" });
                    return welcomeLogChannel.send({
                        reply: { messageReference: awaitedMessage },
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`🔨 | Auto banned ${member.user.tag}${guildDatabases.enableModLog ? `, see <#${guildDatabases.modlogChannel}> for more info` : " | reason: `[Auto ban: user leaving]`"}`)
                                .setColor(botEmbedColor)
                        ]
                    });
                }
            }
        }
        if (!guildDatabases.enableWelcomeLog && guildDatabases.enableAutoBan) {
            if (guildDatabases.enableModLog) {
                const modLogChannel = member.guild.channels.resolve(guildDatabases.modlogChannel);
                if (modLogChannel?.isText()) {
                    await modLogChannel.send({
                        embeds: [
                            new MessageEmbed()
                                .addField("**User**", `${member.id} | ${member.user.tag}`)
                                .addField("**Executor**", `${member.guild.me?.user.id} | ${member.guild.me?.user.tag}`)
                                .addField("**Timestamp**", `<t:${Date.now() / 1000 | 0}>`)
                                .setThumbnail(member.displayAvatarURL())
                                .setAuthor("BANNED", member.user.displayAvatarURL())
                                .addField("**Reason**", "Auto ban: user leaving")
                                .setColor(botEmbedColor)
                        ]
                    });
                }
            }
            await member.guild.members.ban(member, { reason: "Auto ban: user leaving" });
        }
    }
}
