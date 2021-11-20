import { CommandOptions, Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Collection, Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../../config";

@ApplyOptions<CommandOptions>({
    name: "prune",
    description: "prune user message or channel message",
    requiredClientPermissions: ["SEND_MESSAGES"]
})

export class ClientCommand extends Command {
    async messageRun(message: Message, args: Args) {
        const lookupUserArgs = await args.pickResult("member");
        /* eslint no-negated-condition: "off" */
        if (!lookupUserArgs.success) {
            const messageToDeleteArgs = await args.pickResult("number");
            if (message.channel.isText() && message.inGuild()) {
                const deletedMessage = await message.channel.bulkDelete(messageToDeleteArgs.value ?? 10, true);
                await message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`✅ | Pruned ${deletedMessage.size} messages`)
                            .setColor(botEmbedColor)
                    ]
                });
            }
        } else {
            const messageToDeleteArgs = await args.pickResult("number");
            const filteredMessage = this.transformToCollection([...message.channel.messages.cache.filter(x => x.author.id === lookupUserArgs.value.user.id).values()].splice(0, messageToDeleteArgs.value ?? 10));
            if (message.channel.isText() && message.inGuild()) {
                const deletedMessage = await message.channel.bulkDelete(filteredMessage, true);
                await message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`✅ | Pruned ${deletedMessage.size} ${lookupUserArgs.value.displayName} messages`)
                            .setColor(botEmbedColor)
                    ]
                });
                filteredMessage.clear();
            }
        }
    }

    public transformToCollection(array: Message[]) {
        const temporaryCollection: Collection<string, Message> = new Collection();
        for (const data of array) {
            temporaryCollection.set(data.id, data);
            continue;
        }
        return temporaryCollection;
    }
}
