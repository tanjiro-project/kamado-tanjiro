import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { SubCommandPluginCommand } from "@sapphire/plugin-subcommands";
import { Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../../config";
import crypto from "crypto";

@ApplyOptions<SubCommandPluginCommand.Options>({
    name: "warn",
    subCommands: ["update", "delete", { input: "runCmd", default: true }],
    options: ["case"],
    requiredUserPermissions: ["MANAGE_GUILD"]
})

export class clientCommand extends SubCommandPluginCommand {
    public async runCmd(message: Message, args: Args) {
        const user = (await args.pickResult("member")).value ?? message.mentions.members?.filter(x => x.user !== this.container.client.user).first();
        const cases = crypto.randomBytes(3).toString("hex");
        const reason = (await args.restResult("string")).value ?? `t!warn update --case=${cases} {reason}`;
        const guildDatabases = await this.container.client.databases.guilds.get(message.guildId!);
        if (!user) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`⚠ | Please mention member / input user id`)
                        .setColor(botEmbedColor)
                ]
            });
        }
        const awaitedMessage = await message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(`⚠ | Trying to warn ${user?.user.username}`)
                    .setColor(botEmbedColor)
            ]
        });
        if (guildDatabases.enableModLog && user) {
            const modLogChannel = message.guild?.channels.resolve(guildDatabases.modlogChannel);
            if (modLogChannel?.isText()) {
                await message.delete();
                const msg = await modLogChannel.send({
                    embeds: [
                        new MessageEmbed()
                            .addField("**User**", `${user.id} | ${user.user.tag}`)
                            .addField("**Executor**", `${message.author.id} | ${message.author.tag}`)
                            .addField("**Timestamp**", `<t:${Date.now() / 1000 | 0}>`)
                            .setThumbnail(user.user.displayAvatarURL())
                            .setAuthor("WARNED", message.author.displayAvatarURL())
                            .addField("**Cases**", cases)
                            .addField("**Reason**", reason)
                            .setColor(botEmbedColor)
                    ]
                });
                await this.container.client.databases.warn.set(message.guildId!, cases, message.author.id, user.id, msg.id, msg.channelId, "reason", reason);
            }
        }
        return awaitedMessage.edit({
            embeds: [
                new MessageEmbed()
                    .setDescription(`⚠ | Warned ${user.user.tag}${guildDatabases.enableModLog ? `, see <#${guildDatabases.modlogChannel}> for more info` : ` | reason: \`[${reason}]\``}`)
                    .setFooter(`Case id: ${cases}`)
                    .setColor(botEmbedColor)
            ]
        });
    }

    public async update(message: Message, args: Args) {
        const reason = (await args.restResult("string")).value;
        if (!reason) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(botEmbedColor)
                        .setDescription(`⚠ | Please input reason`)
                ]
            });
        }
        const cases = args.getOption("case");
        if (!cases) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(botEmbedColor)
                        .setDescription(`⚠ | Please input case id`)
                ]
            });
        }
        const getUserCase = await this.container.client.databases.warn.get(message.guildId!, cases!);
        if (!getUserCase) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(botEmbedColor)
                        .setDescription(`⚠ | No case found with id ${cases}`)
                ]
            });
        }
        const guildDatabases = await this.container.client.databases.guilds.get(message.guildId!);

        const updateCase = await this.container.client.databases.warn.updateReasonCase(message.guildId!, cases!, reason!);
        const modLog = message.guild?.channels.cache.get(updateCase?.modlogChannel!);
        const user = await this.container.client.users.fetch(updateCase?.targetId!)!;
        const awaitedMessage = await message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(`⚠ | Trying to update ${user.tag} case`)
                    .setColor(botEmbedColor)
            ]
        });
        if (modLog && modLog?.isText()) {
            const caseEmbed = await modLog.messages.fetch(updateCase?.messageId!);
            await message.delete();
            caseEmbed.edit({
                embeds: [
                    new MessageEmbed()
                        .addField("**User**", `${user.id} | ${user.tag}`)
                        .addField("**Executor**", `${message.author.id} | ${message.author.tag}`)
                        .addField("**Timestamp**", `<t:${Date.now() / 1000 | 0}>`)
                        .setThumbnail(user.displayAvatarURL())
                        .setAuthor("WARNED", message.author.displayAvatarURL())
                        .addField("**Cases**", cases!)
                        .addField("**Reason**", reason!)
                        .setColor(botEmbedColor)
                ]
            });
        }
        awaitedMessage.edit({
            embeds: [
                new MessageEmbed()
                    .setDescription(`⚠ | Updated reason for ${user.tag} case${guildDatabases.enableModLog ? `, see <#${guildDatabases.modlogChannel}> for more info` : ` | reason: \`[${reason}]\``}`)
                    .setFooter(`Case id: ${cases}`)
                    .setColor(botEmbedColor)
            ]
        });
    }

    public async delete(message: Message, args: Args) {
        const cases = await args.pickResult("string");
        const getUserCase = await this.container.client.databases.warn.get(message.guildId!, cases.value!);
        if (!cases.success) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(botEmbedColor)
                        .setDescription(`⚠ | ${cases.error}`)
                ]
            });
        }
        if (!getUserCase) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(botEmbedColor)
                        .setDescription(`⚠ | No case found with id ${cases.value}`)
                ]
            });
        }
        const modLogChannel = this.container.client.channels.resolve(getUserCase.modlogChannel);
        if (modLogChannel && modLogChannel?.isText()) {
            const warnEmbed = await modLogChannel.messages.fetch(getUserCase.messageId).catch(() => null);
            await warnEmbed?.delete().catch(() => null)
        }
        await this.container.client.databases.warn.deleteCase(message.guildId!, cases.value!);
        
        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(botEmbedColor)
                    .setDescription(`⚠ | Case with id ${cases.value} has been deleted`)
            ]
        });
    }
}
