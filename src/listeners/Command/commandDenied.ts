import { CommandDeniedPayload, Events, Listener, ListenerOptions, UserError } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { MessageEmbed, TextChannel } from "discord.js";
import { botEmbedColor } from "../../config";

@ApplyOptions<ListenerOptions>({
    name: Events.CommandDenied
})

export class clientListener extends Listener {
    run({ context, message: content }: UserError, { message }: CommandDeniedPayload) {
        if (Reflect.get(Object(context), "silent")) return;
        if (!(message.channel as TextChannel).permissionsFor(message.guild?.me!).has('SEND_MESSAGES')) return message.author.send({ embeds: [new MessageEmbed().setDescription(`❌ | I dont have send message permissions in ${message.channel.toString()}`).setColor(botEmbedColor)], allowedMentions: { users: [message.author.id], roles: [] } }).catch(e => null);
        return message.channel.send({ embeds: [new MessageEmbed().setDescription(content).setColor(botEmbedColor)], allowedMentions: { users: [message.author.id], roles: [] } });
    }
}
