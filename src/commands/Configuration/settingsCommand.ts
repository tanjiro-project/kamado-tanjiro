import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { SubCommandPluginCommand } from "@sapphire/plugin-subcommands";
import { stripIndents } from "common-tags";
import { Message, MessageEmbed } from "discord.js";
import { botEmbedColor } from "../../config";

@ApplyOptions<SubCommandPluginCommand.Options>({
    name: "settings",
    subCommands: ["modlog", "auditlog", "welcomelog", "tempvoice", "autorole", { input: "show", default: true }],
    requiredUserPermissions: ["MANAGE_GUILD"]
})
export class clientCommand extends SubCommandPluginCommand {
    public async show(message: Message, args: Args) {
        await message.reply({
            embeds: [new MessageEmbed()
                .setAuthor(`${this.container.client.user!.username} Settings`, this.container.client.user!.displayAvatarURL())
                .setDescription(`Type \`${args.commandContext.prefix}settings <option>\` to view more about an option. Available options :`)
                .addField("🛡 Moderation log", `${args.commandContext.commandPrefix}settings modlog`, true)
                .addField("🔐 Audit log", `${args.commandContext.commandPrefix}settings auditlog`, true)
                .addField("👥 Welcome log", `${args.commandContext.commandPrefix}settings welcomelog`, true)
                .addField("🔉 Temporary voice", `${args.commandContext.commandPrefix}settings tempvoice`, true)
                .addField("🧻 Autorole", `${args.commandContext.commandPrefix}settings autorole`, true)
                .setColor(botEmbedColor)]
        });
    }

    public async modlog(message: Message, args: Args) {
        const channelArgs = await args.pickResult("guildChannel");
        const status = await args.pickResult("string");
        if (!channelArgs.success || (!status.success || !["enable", "disable"].includes(status.value))) {
            return message.reply({
                embeds: [
                    this.createEmbed(
                        message, "🛡 Moderation log", stripIndents`
                            Example: ${args.commandContext.prefix as string}settings modlog ${message.channel.toString()} enable
                        `
                    )
                ]
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
        const status = await args.pickResult("string");
        if (!channelArgs.success || (!status.success || !["enable", "disable"].includes(status.value))) {
            return message.reply({
                embeds: [
                    this.createEmbed(
                        message, "🔐 Audit log", stripIndents`
                            Example: ${args.commandContext.prefix as string}settings auditlog ${message.channel.toString()} enable
                        `
                    )
                ]
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
        const status = await args.pickResult("string");
        if (!channelArgs.success || (!status.success || !["enable", "disable"].includes(status.value))) {
            return message.reply({
                embeds: [
                    this.createEmbed(
                        message, "👥 Welcome log", stripIndents`
                            Example: ${args.commandContext.prefix as string}settings welcomelog ${message.channel.toString()} enable
                        `
                    )
                ]
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
        const status = await args.pickResult("string");
        if (!channelArgs.success || (!status.success || !["enable", "disable"].includes(status.value))) {
            return message.reply({
                embeds: [
                    this.createEmbed(
                        message, "🔉 Temporary voice", stripIndents`
                            Example: ${args.commandContext.prefix as string}settings tempvoice ${message.guild?.channels.cache.filter(x => x.type === "GUILD_VOICE").first()?.toString() ?? "#VoiceChannel"} enable
                        `
                    )
                ]
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

    public async autorole(message: Message, args: Args) {
        const roleArgs = await args.pickResult("role");
        const status = await args.pickResult("string");
        if (!roleArgs.success || (!status.success || !["enable", "disable"].includes(status.value))) {
            return message.reply({
                embeds: [
                    this.createEmbed(
                        message, "🧻 Autorole", stripIndents`
                            Example: ${args.commandContext.prefix as string}settings autorole ${message.guild?.roles.cache.filter(x => x.id !== message.guildId).first()?.toString() ?? "@Role"} enable
                        `
                    )
                ]
            });
        }
        await this.container.client.databases.guilds.set(message.guildId!, "autoRoleId", roleArgs.value.id);
        await this.container.client.databases.guilds.set(message.guildId!, "enableAutoRole", status.value === "enable");

        return message.reply({
            embeds: [new MessageEmbed()
                .setDescription(`✔ | Autorole ${status.value === "enable" ? "enabled" : "disabled"} for role ${roleArgs.value.toString()}`)
                .setColor(botEmbedColor)]
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
