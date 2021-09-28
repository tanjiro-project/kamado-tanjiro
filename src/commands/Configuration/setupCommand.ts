import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { SubCommandPluginCommand } from "@sapphire/plugin-subcommands";
import { Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../../config";

@ApplyOptions<SubCommandPluginCommand.Options>({
    name: "setup",
    subCommands: ["modlog", { input: "show", default: true }]
})
export class clientCommand extends SubCommandPluginCommand {
    public async show(message: Message) {
        message.reply({
            embeds: [new MessageEmbed().setDescription(`
            - setup modlog {channel} [status]
            `)
                .setColor(botEmbedColor)]
        });
    }

    public async modlog(message: Message, args: Args) {
        const channelArgs = await args.pickResult("guildChannel");
        if (!channelArgs.success) {
            return message.reply({
                embeds: [new MessageEmbed().setDescription(`❌ | ${channelArgs.error.message}`).setColor(botEmbedColor)]
            });
        }
        const status = await args.pickResult("string");
        if (!status.success || !["enable", "disable"].includes(status.value)) {
            return message.reply({
                embeds: [new MessageEmbed().setDescription(`❌ | Status must be enable/disable`).setColor(botEmbedColor)]
            });
        }
        await this.container.client.databases.guilds.set(message.guildId!, "modlogChannel", channelArgs.value.id);
        await this.container.client.databases.guilds.set(message.guildId!, "enableModLog", status.value === "enable");

        return message.reply({
            embeds: [new MessageEmbed()
                .setDescription(`✔ | Modlog ${status.value === "enable" ? "enabled" : "disabled"} on ${channelArgs.value.toString()}`)
                .setColor(botEmbedColor)]
        });
    }
}
