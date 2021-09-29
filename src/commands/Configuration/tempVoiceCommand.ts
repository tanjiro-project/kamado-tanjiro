import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { SubCommandPluginCommand } from "@sapphire/plugin-subcommands";
import { Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../../config";

@ApplyOptions<SubCommandPluginCommand.Options>({
    name: "tempvoice",
    subCommands: ["channelname", { input: "show", default: true }],
    requiredUserPermissions: ["MANAGE_GUILD"]
})
export class clientCommand extends SubCommandPluginCommand {
    public async show(message: Message, args: Args) {
        message.reply({
            embeds: [new MessageEmbed().setDescription(`
            - ${args.commandContext.commandPrefix}tempvoice channelname {name for created temp voice}
            `)
                .setColor(botEmbedColor)]
        });
    }

    public async channelname(message: Message, args: Args) {
        const newNameTemplate = await args.restResult("string");
        if (newNameTemplate.success) {
            await this.container.client.databases.guilds.set(message.guildId!, "tempVoiceName", newNameTemplate.value);
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`✅ | Channel name template has been saved.`)
                        .setColor(botEmbedColor)
                ]
            });
        }
    }
}
