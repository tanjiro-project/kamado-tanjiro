import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { SubCommandPluginCommand } from "@sapphire/plugin-subcommands";
import { stripIndents } from "common-tags";
import { Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../../config";

@ApplyOptions<SubCommandPluginCommand.Options>({
    name: "tempvoice",
    subCommands: ["channelname", { input: "show", default: true }],
    requiredUserPermissions: ["MANAGE_GUILD"]
})
export class clientCommand extends SubCommandPluginCommand {
    public async show(message: Message, args: Args) {
        return message.reply({
            embeds: [new MessageEmbed()
                .setAuthor(`${this.container.client.user!.username} TempVoice Settings`, this.container.client.user!.displayAvatarURL())
                .setDescription(`Type \`${args.commandContext.prefix}tempvoice <option>\` to view more about an option. Available options :`)
                .addField("🔰 Channel Name", `${args.commandContext.commandPrefix}tempvoice channelname`, true)
                .setColor(botEmbedColor)]
        });
    }

    public async channelname(message: Message, args: Args) {
        const newNameTemplate = await args.restResult("string");
        if (!newNameTemplate.success) {
            return message.reply({
                embeds: [
                    this.createEmbed(
                        message, "🔰 Channel Name", stripIndents`
                            Example: ${args.commandContext.prefix}tempvoice channelname {user.username} | Voice
                        `
                    )
                ]
            });
        }
        await this.container.client.databases.guilds.set(message.guildId!, "tempVoiceName", newNameTemplate.value);
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription("✅ | Channel name template has been saved.")
                    .setColor(botEmbedColor)
            ]
        });
    }

    private createEmbed(message: Message, name: string, usage: string): MessageEmbed {
        return new MessageEmbed()
            .setAuthor(`${message.guild!.name} Setting - ${name}`, this.container.client.user!.displayAvatarURL())
            .setDescription("**INFO** : Hooks such as [] or <> are not to be used when using commands")
            .addField("ℹ Usage", usage)
            .setColor(botEmbedColor);
    }
}
