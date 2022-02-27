import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../../config";

@ApplyOptions<CommandOptions>({
    name: "create"
})

export class CreateCommand extends Command {
    public async messageRun(message: Message, args: Args) {
        const name = await args.pickResult("string");
        const content = await args.restResult("string");

        if (!name.value) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(botEmbedColor)
                        .setDescription("❌ | You need to specify a name for the tag")
                ]
            });
        }
        if (!content.value) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(botEmbedColor)
                        .setDescription("❌ | You need to specify a content for the tag")
                ]
            });
        }
        const tag = await this.container.client.databases.tag.find(message.guild?.id!, name.value);
        if (tag) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(botEmbedColor)
                        .setDescription(`❌ | Already have a tag with the name \`${name.value}\``)
                ]
            });
        }
        await this.container.client.databases.tag.create(message.guild?.id!, message.author.id, { name: name.value, content: content.value });
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(botEmbedColor)
                    .setDescription(`✅ | Created tag \`${name.value}\``)
            ]
        });
    }
}
