import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../../config";

@ApplyOptions<CommandOptions>({
    name: "delete"
})

export class DeleteCommand extends Command {
    public async messageRun(message: Message, args: Args) {
        const name = await args.pickResult("string");
        if (!name.value) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(botEmbedColor)
                        .setDescription("❌ | You need to specify a name for the tag")
                ]
            });
        }
        const tag = await this.container.client.databases.tag.find(message.guild?.id!, name.value);
        if (!tag) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(botEmbedColor)
                        .setDescription(`❌ | Could not find tag with with the name \`${name.value}\``)
                ]
            });
        }
        if (tag.authorId === message.author.id || message.member?.permissions.has("MANAGE_GUILD")) {
            await this.container.client.databases.tag.delete(message.guild?.id!, message.author.id, name.value);
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(botEmbedColor)
                        .setDescription(`✅ | Deleted tag \`${name.value}\``)
                ]
            });
        }
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(botEmbedColor)
                    .setDescription("❌ | You dont have the permission to delete this tag")
            ]
        });
    }
}
