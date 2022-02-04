import { CommandOptions, Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { GuildMember, Message, MessageEmbed, User } from "discord.js";
import { botEmbedColor } from "../../config";

@ApplyOptions<CommandOptions>({
    name: "ban",
    description: "Ban user from server",
    requiredClientPermissions: ["BAN_MEMBERS"],
    requiredUserPermissions: ["BAN_MEMBERS"],
    options: ["days"]
})

export class ClientCommand extends Command {
    async messageRun(message: Message, args: Args) {
        const user = this.container.client.users.resolve((await args.pickResult("member")).value!) ?? this.container.client.users.resolve(message.mentions.members?.filter(x => x.user !== this.container.client.user).first()!) ?? await this.container.client.users.fetch((await args.pickResult("string")).value!).catch(() => undefined!);
        const reason = (await args.restResult("string")).value ?? "No reason specified.";
        const days = Number(args.getOption("number")) ?? undefined;
        const guildDatabases = await this.container.client.databases.guilds.get(message.guildId!);
        if (!user) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription("⚠ | Please mention member / input user id")
                        .setColor(botEmbedColor)
                ]
            });
        }
        const awaitedMessage = await message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(`⚠ | Trying to ban ${user.username}`)
                    .setColor(botEmbedColor)
            ]
        });
        const bannedUser = this.container.client.users.resolve(await message.guild?.members.ban(user, { days, reason }) as GuildMember | User);
        if (!bannedUser) {
            return awaitedMessage.edit({
                embeds: [
                    new MessageEmbed()
                        .setDescription("⚠ | Unknown user, discontinuted ban")
                        .setColor(botEmbedColor)
                ]
            });
        }
        if (guildDatabases.enableModLog && bannedUser) {
            const modLogChannel = message.guild?.channels.resolve(guildDatabases.modlogChannel);
            if (modLogChannel?.isText()) {
                await message.delete();
                await modLogChannel.send({
                    embeds: [
                        new MessageEmbed()
                            .addField("**User**", `${bannedUser.id} | ${bannedUser.tag}`)
                            .addField("**Executor**", `${message.author.id} | ${message.author.tag}`)
                            .addField("**Timestamp**", `<t:${Date.now() / 1000 | 0}>`)
                            .setThumbnail(bannedUser.displayAvatarURL())
                            .setAuthor("BANNED", message.author.displayAvatarURL())
                            .addField("**Reason**", reason)
                            .setColor(botEmbedColor)
                    ]
                });
            }
        }
        return awaitedMessage.edit({
            embeds: [
                new MessageEmbed()
                    .setDescription(`⚠ | Banned ${bannedUser.tag}${guildDatabases.enableModLog ? `, see <#${guildDatabases.modlogChannel}> for more info` : ` | reason: \`[${reason}]\``}`)
                    .setColor(botEmbedColor)
            ]
        });
    }
}
