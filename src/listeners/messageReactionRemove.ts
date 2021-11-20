import { Listener, ListenerOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { MessageReaction, User } from "discord.js";
@ApplyOptions<ListenerOptions>({
    name: "messageReactionRemove"
})

export class guildMemberAddEvent extends Listener {
    async run(messageReaction: MessageReaction, user: User) {
        const guildDatabases = await this.container.client.databases.guildRole.get(messageReaction.message.guildId!, messageReaction.message.channelId, messageReaction.message.id, messageReaction.emoji.id ?? messageReaction.emoji.name!);
        if (guildDatabases && !messageReaction.me) {
            const guild = messageReaction.partial ? await messageReaction.message.guild?.fetch() : messageReaction.message.guild;
            const guildMember = await guild?.members.fetch(user);
            await guildMember?.roles.remove(guildDatabases.roleId);
        }
    }
}
