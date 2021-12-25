import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { SubCommandPluginCommand } from "@sapphire/plugin-subcommands";
import { Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../../config";
import ms from "ms";

@ApplyOptions<SubCommandPluginCommand.Options>({
    name: "tempmute",
    subCommands: ["remove", { input: "runCmd", default: true }],
    requiredUserPermissions: ["MODERATE_MEMBERS"]
})
export class clientCommand extends SubCommandPluginCommand {
    public async runCmd(message: Message, args: Args) {
        const user = this.container.client.users.resolve((await args.pickResult("member")).value!) ?? this.container.client.users.resolve(message.mentions.members?.filter(x => x.user !== this.container.client.user).first()!) ?? await this.container.client.users.fetch((await args.pickResult("string")).value!).catch(() => undefined!);
        const timeout = (await args.pickResult("string")).value ?? "1h";
        const reason = (await args.restResult("string")).value ?? "No reason specified.";
        if (!["60s", "1m", "5m", "10m", "60m", "1h", "1d", "7d", "1w"].includes(timeout)) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`⚠ | Please input valid timeout duration`)
                        .setColor(botEmbedColor)
                ]
            });
        }
        const guildDatabases = await this.container.client.databases.guilds.get(message.guildId!);
        if (!user) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`⚠ | Please mention member / input valid user id`)
                        .setColor(botEmbedColor)
                ]
            });
        }
        const awaitedMessage = await message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(`⚠ | Trying to temporary mute ${user.username}`)
                    .setColor(botEmbedColor)
            ]
        });
        const mutedUser = await message.guild?.members.resolve(user)?.timeout(this.resolveTimeout(timeout), reason)!;
        if (guildDatabases.enableModLog) {
            const modLogChannel = message.guild?.channels.resolve(guildDatabases.modlogChannel);
            if (modLogChannel?.isText()) {
                await message.delete();
                await modLogChannel.send({
                    embeds: [
                        new MessageEmbed()
                            .addField("**User**", `${mutedUser.id} | ${mutedUser.user.tag}`)
                            .addField("**Executor**", `${message.author.id} | ${message.author.tag}`)
                            .addField("**Timestamp**", `<t:${Date.now() / 1000 | 0}>`)
                            .addField("**Duration**", `<t:${mutedUser?.communicationDisabledUntilTimestamp! / 1000 | 0}>`)
                            .setThumbnail(mutedUser.user.displayAvatarURL())
                            .setAuthor("TEMPORARY MUTED", message.author.displayAvatarURL())
                            .addField("**Reason**", reason)
                            .setColor(botEmbedColor)
                    ]
                });
            }
        }

        return awaitedMessage.edit({
            embeds: [
                new MessageEmbed()
                    .setDescription(`⚠ | Temporary Muted ${mutedUser.user.tag}${guildDatabases.enableModLog ? `, see <#${guildDatabases.modlogChannel}> for more info` : ` | reason: \`[${reason}]\``}`)
                    .setFooter(`Duration: ${ms(this.resolveTimeout(timeout)!, { long: true })}`)
                    .setColor(botEmbedColor)
            ]
        });
    }

    public async remove(message: Message, args: Args) {
        const user = this.container.client.users.resolve((await args.pickResult("member")).value!) ?? this.container.client.users.resolve(message.mentions.members?.filter(x => x.user !== this.container.client.user).first()!) ?? await this.container.client.users.fetch((await args.pickResult("string")).value!).catch(() => undefined!);
        const reason = (await args.restResult("string")).value ?? "No reason specified.";

        const guildDatabases = await this.container.client.databases.guilds.get(message.guildId!);
        if (!user) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`⚠ | Please mention member / input valid user id`)
                        .setColor(botEmbedColor)
                ]
            });
        }

        const awaitedMessage = await message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(`⚠ | Trying to remove temporary mute ${user.username}`)
                    .setColor(botEmbedColor)
            ]
        });

        const mutedUser = await message.guild?.members.resolve(user)?.timeout(null, reason)!;
        if (guildDatabases.enableModLog) {
            const modLogChannel = message.guild?.channels.resolve(guildDatabases.modlogChannel);
            if (modLogChannel?.isText()) {
                await message.delete();
                await modLogChannel.send({
                    embeds: [
                        new MessageEmbed()
                            .addField("**User**", `${mutedUser.id} | ${mutedUser.user.tag}`)
                            .addField("**Executor**", `${message.author.id} | ${message.author.tag}`)
                            .addField("**Timestamp**", `<t:${Date.now() / 1000 | 0}>`)
                            .setThumbnail(mutedUser.user.displayAvatarURL())
                            .setAuthor("REMOVE TEMPORARY MUTED", message.author.displayAvatarURL())
                            .addField("**Reason**", reason)
                            .setColor(botEmbedColor)
                    ]
                });
            }
        }

        return awaitedMessage.edit({
            embeds: [
                new MessageEmbed()
                    .setDescription(`⚠ | Removed Temporary Mute ${mutedUser.user.tag}${guildDatabases.enableModLog ? `, see <#${guildDatabases.modlogChannel}> for more info` : ` | reason: \`[${reason}]\``}`)
                    .setColor(botEmbedColor)
            ]
        });
    }

    public resolveTimeout(date: string) {
        if (["1m", "60s"].includes(date)) return 1 * 60 * 1000;
        if (["10m"].includes(date)) 10 * 60 * 1000;
        if (["60m", "1h"].includes(date)) return 60 * 60 * 1000;
        if (["24h", "1d"].includes(date)) return 1440 * 60 * 1000;
        if (["7d", "1w"].includes(date)) return (1440 * 60 * 7) * 1000;
        return null;
    }
}
