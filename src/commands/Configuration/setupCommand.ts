import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { SubCommandPluginCommand } from "@sapphire/plugin-subcommands";
import { Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../../config";

@ApplyOptions<SubCommandPluginCommand.Options>({
    name: "setup",
    subCommands: ["modlog", "auditlog", "welcomelog", "tempvoice", { input: "show", default: true }],
    requiredUserPermissions: ["MANAGE_GUILD"]
})
export class clientCommand extends SubCommandPluginCommand {
    public async show(message: Message, args: Args) {
        message.reply({
            embeds: [new MessageEmbed().setDescription(`
            - ${args.commandContext.commandPrefix}setup modlog {channel} [status]
            - ${args.commandContext.commandPrefix}setup auditlog {channel} [status]
            - ${args.commandContext.commandPrefix}setup welcomelog {channel} [status]
            - ${args.commandContext.commandPrefix}setup tempvoice {voice channel} [status]
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

    public async auditlog(message: Message, args: Args) {
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
        await this.container.client.databases.guilds.set(message.guildId!, "auditLogChannel", channelArgs.value.id);
        await this.container.client.databases.guilds.set(message.guildId!, "enableAuditLog", status.value === "enable");

        return message.reply({
            embeds: [new MessageEmbed()
                .setDescription(`✔ | Auditlog ${status.value === "enable" ? "enabled" : "disabled"} on ${channelArgs.value.toString()}`)
                .setColor(botEmbedColor)]
        });
    }

    public async welcomelog(message: Message, args: Args) {
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
        await this.container.client.databases.guilds.set(message.guildId!, "welcomeLogChannel", channelArgs.value.id);
        await this.container.client.databases.guilds.set(message.guildId!, "enableWelcomeLog", status.value === "enable");

        return message.reply({
            embeds: [new MessageEmbed()
                .setDescription(`✔ | Welcomelog ${status.value === "enable" ? "enabled" : "disabled"} on ${channelArgs.value.toString()}`)
                .setColor(botEmbedColor)]
        });
    }

    public async tempvoice(message: Message, args: Args) {
        const channelArgs = await args.pickResult("guildVoiceChannel");
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
        await this.container.client.databases.guilds.set(message.guildId!, "tempVoiceChannel", channelArgs.value.id);
        await this.container.client.databases.guilds.set(message.guildId!, "enableTempVoiceChannel", status.value === "enable");

        return message.reply({
            embeds: [new MessageEmbed()
                .setDescription(`✔ | Temporary voice ${status.value === "enable" ? "enabled" : "disabled"} on ${channelArgs.value.toString()}`)
                .setColor(botEmbedColor)]
        });
    }
}
