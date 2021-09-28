import { Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { GuildMember, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../config";
@ApplyOptions<ListenerOptions>({
    name: "guildMemberAdd"
})

export class guildMemberAddEvent extends Listener {
    async run(member: GuildMember) {
        const guildDatabases = await this.container.client.databases.guilds.get(member.guild.id);
        if (guildDatabases.enableWelcomeLog) {
            const welcomeLogChannel = this.container.client.channels.resolve(guildDatabases.welcomeLogChannel);
            if (welcomeLogChannel && welcomeLogChannel.isText()) {
                return welcomeLogChannel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`🍵 | Everyone welcome ${member.user.tag} to the server!`)
                            .setColor(botEmbedColor)
                    ]
                });
            }
        }
    }
}
