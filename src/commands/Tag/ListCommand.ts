import { ApplyOptions } from "@sapphire/decorators";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";
import { Command, CommandOptions } from "@sapphire/framework";
import { chunk } from "@sapphire/utilities";
import { Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../../config";
import { Tag } from "../../entities/Tag";

@ApplyOptions<CommandOptions>({
    name: "list"
})

export class ListCommand extends Command {
    public async messageRun(message: Message) {
        const tags = await this.container.client.databases.tag.findAll(message.guild?.id!);

        if (tags.length === 0) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(botEmbedColor)
                        .setDescription("❌ | There are no tags in this server")
                ]
            });
        }
        const pages = chunk(tags.map((x: Tag, i: number) => `\`${i + 1})\` ${x.name} [<@${x.authorId}>]`), 15);
        const PaginationMessage = new PaginatedMessage();
        for (const page of pages) {
            PaginationMessage.addPageEmbed(embed => embed.setDescription(page.join("\n"))
                .setColor(botEmbedColor)
                .setThumbnail(message.guild?.iconURL()!)
                .setAuthor({ name: message.guild?.name!, url: "https://nezu.my.id" }));
        }
        await PaginationMessage.run(message);
    }
}
