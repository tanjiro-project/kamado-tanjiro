import { Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { GuildMember, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../config";
@ApplyOptions<ListenerOptions>({
    name: "guildMemberRemove"
})

export class guildMemberRemoveEvent extends Listener {
    async run(member: GuildMember) {
        const guildDatabases = await this.container.client.databases.guilds.get(member.guild.id);
        if (guildDatabases.enableWelcomeLog) {
            const welcomeLogChannel = this.container.client.channels.resolve(guildDatabases.welcomeLogChannel);
            if (welcomeLogChannel && welcomeLogChannel.isText()) {
                return welcomeLogChannel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`🍞 | Looks like ${member.user.tag} not our member again!`)
                            .setColor(botEmbedColor)
                    ]
                });
            }
        }
    }
}
