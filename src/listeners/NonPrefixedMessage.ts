import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { LimitedCollection, Message, MessageEmbed, Snowflake } from "discord.js";
import { botEmbedColor } from "../config";
import fetch from "petitio";
import { URL } from "url";

@ApplyOptions<ListenerOptions>({
    name: Events.NonPrefixedMessage
})

export class NonPrefixedMessage extends Listener {
    async run(message: Message) {
        const guildDatabases = await this.container.client.databases.guilds.get(message.guild?.id!);
        if (message.mentions.members?.size! > 4 || message.mentions.users.size > 4) {
            if (this.mentionSpamAttempt.has(message.author.id)) {
                let userAttempt = this.mentionSpamAttempt.get(message.author.id)!;
                userAttempt++;
                this.mentionSpamAttempt.set(message.author.id, userAttempt);
                setTimeout(() => this.mentionSpamAttempt.delete(message.author.id), 4000);
                if ((userAttempt >= 3 && userAttempt < 4) && guildDatabases.enableAutoMod && guildDatabases.enableAuditLog && !message.guild?.roles.cache.has(guildDatabases.muteRoleId)) {
                    message.member?.kick().catch(() => null);
                    const modLogChannel = message.guild?.channels.resolve(guildDatabases.modlogChannel);
                    if (modLogChannel?.isText()) {
                        await modLogChannel.send({
                            embeds: [
                                new MessageEmbed()
                                    .addField("**User**", `${message.member?.id} | ${message.member?.user.tag}`)
                                    .addField("**Executor**", `${message.member?.guild.me?.user.id} | ${message.member?.guild.me?.user.tag}`)
                                    .addField("**Timestamp**", `<t:${Date.now() / 1000 | 0}>`)
                                    .setThumbnail(message.member?.displayAvatarURL()!)
                                    .setAuthor("KICKED", message.member?.user.displayAvatarURL())
                                    .addField("**Reason**", "Auto mod: mention spam")
                                    .setColor(botEmbedColor)
                            ]
                        });
                    }
                    return message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`🔨 | Auto kicked ${message.member?.user.tag}${guildDatabases.enableModLog ? `, see <#${guildDatabases.modlogChannel}> for more info` : ` | reason: \`[Auto mod: mention spam]\``}`)
                                .setColor(botEmbedColor)
                        ]
                    });
                } else if ((userAttempt >= 3 && userAttempt < 4) && guildDatabases.enableAutoMod && !message.guild?.roles.cache.has(guildDatabases.muteRoleId)) {
                    message.member?.kick("Auto mod: spam ping").catch(() => null);
                    return message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`🔨 | Auto kicked ${message.member?.user.tag}${guildDatabases.enableModLog ? `, see <#${guildDatabases.modlogChannel}> for more info` : ` | reason: \`[Auto mod: mention spam]\``}`)
                                .setColor(botEmbedColor)
                        ]
                    });
                } else if ((userAttempt >= 3 && userAttempt < 4) && guildDatabases.enableAutoMod && guildDatabases.enableModLog && message.guild?.roles.cache.has(guildDatabases.muteRoleId)) {
                    message.member?.roles.add(guildDatabases.muteRoleId).catch(() => null);
                    const modLogChannel = message.guild.channels.resolve(guildDatabases.modlogChannel);
                    if (modLogChannel?.isText()) {
                        await modLogChannel.send({
                            embeds: [
                                new MessageEmbed()
                                    .addField("**User**", `${message.member?.id} | ${message.member?.user.tag}`)
                                    .addField("**Executor**", `${message.member?.guild.me?.user.id} | ${message.member?.guild.me?.user.tag}`)
                                    .addField("**Timestamp**", `<t:${Date.now() / 1000 | 0}>`)
                                    .setThumbnail(message.member?.displayAvatarURL()!)
                                    .setAuthor("MUTED", message.member?.user.displayAvatarURL())
                                    .addField("**Reason**", "Auto mod: mention spam")
                                    .setColor(botEmbedColor)
                            ]
                        });
                    }
                    return message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`🔨 | Auto muted ${message.member?.user.tag}${guildDatabases.enableModLog ? `, see <#${guildDatabases.modlogChannel}> for more info` : ` | reason: \`[Auto mod: mention spam]\``}`)
                                .setColor(botEmbedColor)
                        ]
                    });
                }
            } else { this.mentionSpamAttempt.set(message.author.id, 1); }
        }
        if (this.spamAttempt.has(message.author.id)) {
            let userAttempt = this.spamAttempt.get(message.author.id)!;
            userAttempt++;
            this.spamAttempt.set(message.author.id, userAttempt);
            setTimeout(() => this.spamAttempt.delete(message.author.id), 10000);
            if ((userAttempt >= 10 && userAttempt < 11) && guildDatabases.enableAutoMod && guildDatabases.enableAuditLog && !message.guild?.roles.cache.has(guildDatabases.muteRoleId)) {
                message.member?.kick().catch(() => null);
                const modLogChannel = message.guild?.channels.resolve(guildDatabases.modlogChannel);
                if (modLogChannel?.isText()) {
                    await modLogChannel.send({
                        embeds: [
                            new MessageEmbed()
                                .addField("**User**", `${message.member?.id} | ${message.member?.user.tag}`)
                                .addField("**Executor**", `${message.member?.guild.me?.user.id} | ${message.member?.guild.me?.user.tag}`)
                                .addField("**Timestamp**", `<t:${Date.now() / 1000 | 0}>`)
                                .setThumbnail(message.member?.displayAvatarURL()!)
                                .setAuthor("KICKED", message.member?.user.displayAvatarURL())
                                .addField("**Reason**", "Auto mod: message spam")
                                .setColor(botEmbedColor)
                        ]
                    });
                }
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`🔨 | Auto kicked ${message.member?.user.tag}${guildDatabases.enableModLog ? `, see <#${guildDatabases.modlogChannel}> for more info` : ` | reason: \`[Auto mod: message spam]\``}`)
                            .setColor(botEmbedColor)
                    ]
                });
            } else if ((userAttempt >= 10 && userAttempt < 11) && guildDatabases.enableAutoMod && !message.guild?.roles.cache.has(guildDatabases.muteRoleId)) {
                message.member?.kick("Auto mod: message spam").catch(() => null);
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`🔨 | Auto kicked ${message.member?.user.tag}${guildDatabases.enableModLog ? `, see <#${guildDatabases.modlogChannel}> for more info` : ` | reason: \`[Auto mod: message spam]\``}`)
                            .setColor(botEmbedColor)
                    ]
                });
            } else if ((userAttempt >= 10 && userAttempt < 11) && guildDatabases.enableAutoMod && guildDatabases.enableModLog && message.guild?.roles.cache.has(guildDatabases.muteRoleId)) {
                message.member?.roles.add(guildDatabases.muteRoleId).catch(() => null);
                const modLogChannel = message.guild.channels.resolve(guildDatabases.modlogChannel);
                if (modLogChannel?.isText()) {
                    await modLogChannel.send({
                        embeds: [
                            new MessageEmbed()
                                .addField("**User**", `${message.member?.id} | ${message.member?.user.tag}`)
                                .addField("**Executor**", `${message.member?.guild.me?.user.id} | ${message.member?.guild.me?.user.tag}`)
                                .addField("**Timestamp**", `<t:${Date.now() / 1000 | 0}>`)
                                .setThumbnail(message.member?.displayAvatarURL()!)
                                .setAuthor("MUTED", message.member?.user.displayAvatarURL())
                                .addField("**Reason**", "Auto mod: message spam")
                                .setColor(botEmbedColor)
                        ]
                    });
                }
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`🔨 | Auto muted ${message.member?.user.tag}${guildDatabases.enableModLog ? `, see <#${guildDatabases.modlogChannel}> for more info` : ` | reason: \`[Auto ban: message spam]\``}`)
                            .setColor(botEmbedColor)
                    ]
                });
            }
        } else { this.spamAttempt.set(message.author.id, 1); }
        if (message.type === "GUILD_MEMBER_JOIN" && guildDatabases.enableWelcomeLog) {
            await message.channel.send({
                reply: { messageReference: message },
                embeds: [
                    new MessageEmbed()
                        .setDescription(`🍵 | Everyone welcome ${message.member?.user.tag} to the server!`)
                        .setColor(botEmbedColor)
                ]
            });
        }
        const getScamURL = await fetch("https://krypton.sergioesquina.repl.co/discordscam.json").json();
        const isScam = getScamURL?.scamlinks.includes(this.extractLinkFromContent(message.content)?.hostname);
        if (isScam) {
            message.delete().catch(() => null);
            if (guildDatabases.enableAutoMod && guildDatabases.enableAuditLog && !message.guild?.roles.cache.has(guildDatabases.muteRoleId)) {
                message.member?.kick().catch(() => null);
                const modLogChannel = message.guild?.channels.resolve(guildDatabases.modlogChannel);
                if (modLogChannel?.isText()) {
                    await modLogChannel.send({
                        embeds: [
                            new MessageEmbed()
                                .addField("**User**", `${message.member?.id} | ${message.member?.user.tag}`)
                                .addField("**Executor**", `${message.member?.guild.me?.user.id} | ${message.member?.guild.me?.user.tag}`)
                                .addField("**Timestamp**", `<t:${Date.now() / 1000 | 0}>`)
                                .setThumbnail(message.member?.displayAvatarURL()!)
                                .setAuthor("KICKED", message.member?.user.displayAvatarURL())
                                .addField("**Reason**", "Auto mod: possibility of phishing")
                                .setColor(botEmbedColor)
                        ]
                    });
                }
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`🔨 | Auto kicked ${message.member?.user.tag}${guildDatabases.enableModLog ? `, see <#${guildDatabases.modlogChannel}> for more info` : ` | reason: \`[Auto mod: possibility of phishing]\``}`)
                            .setColor(botEmbedColor)
                    ]
                });
            } else if (guildDatabases.enableAutoMod && !message.guild?.roles.cache.has(guildDatabases.muteRoleId)) {
                message.member?.kick("Auto mod: possibility of phishing").catch(() => null);
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`🔨 | Auto kicked ${message.member?.user.tag}${guildDatabases.enableModLog ? `, see <#${guildDatabases.modlogChannel}> for more info` : ` | reason: \`[Auto mod: possibility of phishing]\``}`)
                            .setColor(botEmbedColor)
                    ]
                });
            } else if (guildDatabases.enableAutoMod && guildDatabases.enableModLog && message.guild?.roles.cache.has(guildDatabases.muteRoleId)) {
                message.member?.roles.add(guildDatabases.muteRoleId).catch(() => null);
                const modLogChannel = message.guild.channels.resolve(guildDatabases.modlogChannel);
                if (modLogChannel?.isText()) {
                    await modLogChannel.send({
                        embeds: [
                            new MessageEmbed()
                                .addField("**User**", `${message.member?.id} | ${message.member?.user.tag}`)
                                .addField("**Executor**", `${message.member?.guild.me?.user.id} | ${message.member?.guild.me?.user.tag}`)
                                .addField("**Timestamp**", `<t:${Date.now() / 1000 | 0}>`)
                                .setThumbnail(message.member?.displayAvatarURL()!)
                                .setAuthor("MUTED", message.member?.user.displayAvatarURL())
                                .addField("**Reason**", "Auto mod: possibility of phishing")
                                .setColor(botEmbedColor)
                        ]
                    });
                }
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`🔨 | Auto muted ${message.member?.user.tag}${guildDatabases.enableModLog ? `, see <#${guildDatabases.modlogChannel}> for more info` : ` | reason: \`[Auto mod: possibility of phishing]\``}`)
                            .setColor(botEmbedColor)
                    ]
                });
            }
        }
    }

    public mentionSpamAttempt: LimitedCollection<Snowflake, number> = new LimitedCollection({ sweepInterval: 120000 });
    public spamAttempt: LimitedCollection<Snowflake, number> = new LimitedCollection({ sweepInterval: 120000 });

    public extractLinkFromContent(args: string) {
        try {
            return new URL(Array.from(args.matchAll(/(?:https?):\/\/[^\n\r ]+(?<=(?: ||))/gim), m => m[0])[0]);
        } catch (e) {
            return null;
        }
    }
}
