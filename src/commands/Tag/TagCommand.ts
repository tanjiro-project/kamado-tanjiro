import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../../config";

@ApplyOptions<CommandOptions>({
    name: "tag",
    aliases: ["view"]
})

export class TagCommand extends Command {
    public async messageRun(message: Message, args: Args) {
        const name = await args.restResult("string");
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
                        .setDescription(`❌ | Could not find a tag with the name \`${name.value}\``)
                ]
            });
        }
        return message.channel.send(String(tag.content));
    }
}
