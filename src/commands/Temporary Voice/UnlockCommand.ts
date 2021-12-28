import { CommandOptions, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../../config";

@ApplyOptions<CommandOptions>({
    name: "unlock",
    description: "Unlock your temporary voice session",
    requiredClientPermissions: ["MANAGE_CHANNELS"]
})

export class ClientCommand extends Command {
    async messageRun(message: Message) {
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

        await voiceChannel.edit({ userLimit: 0 });

        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(botEmbedColor)
                    .setDescription("👌 | Unlocked you current voice session")
            ]
        });
    }
}
