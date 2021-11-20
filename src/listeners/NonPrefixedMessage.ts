import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../config";
@ApplyOptions<ListenerOptions>({
    name: Events.NonPrefixedMessage
})

export class NonPrefixedMessage extends Listener {
    async run(message: Message) {
        const guildDatabases = await this.container.client.databases.guilds.get(message.guild?.id!);

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
    }
}
