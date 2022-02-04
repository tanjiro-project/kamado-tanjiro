import { CommandOptions, Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { GuildEmoji, Message, MessageEmbed, Util } from "discord.js";
import { botEmbedColor } from "../../config";

@ApplyOptions<CommandOptions>({
    name: "reactionrole",
    aliases: ["rr"],
    description: "Setup reaction role",
    requiredClientPermissions: ["MANAGE_GUILD"],
    requiredUserPermissions: ["MANAGE_GUILD"]
})

export class ClientCommand extends Command {
    async messageRun(message: Message, args: Args) {
        const argument = await args.pickResult("string");
        const resolvedMessage = await message.channel.messages.fetch(message.reference?.messageId! ?? argument.value);
        const emojiArgument = await args.pickResult("string");
        const emoji = message.guild?.emojis.resolve(Util.parseEmoji(emojiArgument.value!)?.id!) ?? emojiArgument.value;
        const role = await args.pickResult("role");
        if (!resolvedMessage) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setDescription("⚠ | Please input valid message id or reply")
                        .setColor(botEmbedColor)
                ]
            });
        }

        if (!emoji) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setDescription("⚠ | Please input valid emoji id or name")
                        .setColor(botEmbedColor)
                ]
            });
        }

        if (!role.value) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setDescription("⚠ | Please input valid role id or name")
                        .setColor(botEmbedColor)
                ]
            });
        }

        await this.container.client.databases.guildRole.set(message.guildId!, role.value.id, resolvedMessage.channelId, resolvedMessage.id, "emojiIdOrName", (emoji as GuildEmoji).id ?? emoji);
        await resolvedMessage.react(emoji);
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(`✅ | Successfully setup reaction role for ${role.value.toString()}`)
                    .setColor(botEmbedColor)
            ]
        });
    }
}
