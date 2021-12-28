import { CommandOptions, Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../../config";

@ApplyOptions<CommandOptions>({
    name: "limit",
    description: "Limit your temporary voice session",
    requiredClientPermissions: ["MANAGE_CHANNELS"]
})

export class ClientCommand extends Command {
    async messageRun(message: Message, args: Args) {
        const currentUserVoice = await this.container.client.databases.tempVoice.getUserVoice(message.guild?.id!, message.member?.id!);
        if (!currentUserVoice) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(botEmbedColor)
                        .setDescription("❌ | You dont have any active voice session")
                ]
            });
        }

        const userLimit = await args.pickResult("integer");

        if (!userLimit.value || (userLimit.value < 0 || userLimit.value > 99)) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(botEmbedColor)
                        .setDescription("❌ | User limit must not more than 99 and not less than 0")
                ]
            });
        }

        const voiceChannel = message.guild?.channels.cache.get(currentUserVoice.channelId);

        if (!voiceChannel || !voiceChannel.isVoice()) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(botEmbedColor)
                        .setDescription("❌ | Could not resolve your voice channel")
                ]
            });
        }

        await voiceChannel.edit({
            userLimit: userLimit.value
        });

        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(botEmbedColor)
                    .setDescription(`👌 | Set user limit to ${userLimit.value === 0 ? "Infinity user" : `${userLimit.value} user`}`)
            ]
        });
    }
}
