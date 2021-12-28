import { CommandOptions, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../../config";

@ApplyOptions<CommandOptions>({
    name: "hide",
    description: "Hide your temporary voice session",
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

        await voiceChannel.edit({
            permissionOverwrites: [
                {
                    deny: ["CONNECT", "VIEW_CHANNEL"],
                    id: message.guild?.roles.everyone!
                },
                ...voiceChannel.permissionOverwrites.cache.values()
            ]
        });

        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(botEmbedColor)
                    .setDescription("👌 | Hide you current voice session")
            ]
        });
    }
}
