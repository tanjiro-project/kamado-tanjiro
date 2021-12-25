import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { SubCommandPluginCommand } from "@sapphire/plugin-subcommands";
import { Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../../config";

@ApplyOptions<SubCommandPluginCommand.Options>({
    name: "mute",
    subCommands: ["setrole", { input: "runCmd", default: true }],
    requiredUserPermissions: ["MANAGE_GUILD"]
})
export class clientCommand extends SubCommandPluginCommand {
    public async runCmd(message: Message, args: Args) {
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
                    .setDescription(`⚠ | Trying to mute ${user.username}`)
                    .setColor(botEmbedColor)
            ]
        });
        const mutedUser = await message.guild?.members.resolve(user)?.roles.add(guildDatabases.muteRoleId, reason).catch(() => undefined!);
        if (!mutedUser) {
            return awaitedMessage.edit({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`⚠ | Cannot find ${user.username} in this server`)
                        .setColor(botEmbedColor)
                ]
            });
        }
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
                            .setAuthor("MUTED", message.author.displayAvatarURL())
                            .addField("**Reason**", reason)
                            .setColor(botEmbedColor)
                    ]
                });
            }
        }
        await this.container.client.databases.mutedUser.set(message.guildId!, mutedUser.id, "reason", reason);

        return awaitedMessage.edit({
            embeds: [
                new MessageEmbed()
                    .setDescription(`⚠ | Muted ${mutedUser.user.tag}${guildDatabases.enableModLog ? `, see <#${guildDatabases.modlogChannel}> for more info` : ` | reason: \`[${reason}]\``}`)
                    .setColor(botEmbedColor)
            ]
        });
    }

    public async setrole(message: Message, args: Args) {
        const getRole = await args.pickResult("role");
        if (getRole.success) {
            await this.container.client.databases.guilds.set(message.guildId!, "muteRoleId", getRole.value.id);
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`✅ | Successfully set ${getRole.value.toString()} as muted role.`)
                        .setColor(botEmbedColor)
                ]
            });
        }
    }
}
