import { CommandOptions, Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../../config";

@ApplyOptions<CommandOptions>({
    name: "kick",
    description: "Kick user from server",
    requiredClientPermissions: ["KICK_MEMBERS"],
    requiredUserPermissions: ["KICK_MEMBERS"]
})

export class ClientCommand extends Command {
    async run(message: Message, args: Args) {
        const user = this.container.client.users.resolve((await args.pickResult("member")).value!) ?? this.container.client.users.resolve(message.mentions.members?.filter(x => x.user !== this.container.client.user).first()!) ?? await this.container.client.users.fetch((await args.pickResult("string")).value!).catch(() => undefined!);
        const reason = (await args.restResult("string")).value ?? "No reason specified.";
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
                    .setDescription(`⚠ | Trying to kick ${user.username}`)
                    .setColor(botEmbedColor)
            ]
        });
        const kickedUser = await message.guild?.members.resolve(user)?.kick(reason)!;
        if (guildDatabases.enableModLog) {
            const modLogChannel = message.guild?.channels.resolve(guildDatabases.modlogChannel);
            if (modLogChannel?.isText()) {
                await message.delete();
                await modLogChannel.send({
                    embeds: [
                        new MessageEmbed()
                            .addField("**User**", `${kickedUser.id} | ${kickedUser.user.tag}`)
                            .addField("**Executor**", `${message.author.id} | ${message.author.tag}`)
                            .addField("**Timestamp**", `<t:${Date.now() / 1000 | 0}>`)
                            .setThumbnail(kickedUser.user.displayAvatarURL())
                            .setAuthor("KICKED", message.author.displayAvatarURL())
                            .addField("**Reason**", reason)
                            .setColor(botEmbedColor)
                    ]
                });
            }
        }
        return awaitedMessage.edit({
            embeds: [
                new MessageEmbed()
                    .setDescription(`⚠ | Kicked ${kickedUser.user.tag}${guildDatabases.enableModLog ? `, see <#${guildDatabases.modlogChannel}> for more info` : ` | reason: \`[${reason}]\``}`)
                    .setColor(botEmbedColor)
            ]
        });
    }
}
