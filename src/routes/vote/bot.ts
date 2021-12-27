import { Embed } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import { ApiRequest, ApiResponse, methods, Route, RouteOptions } from "@sapphire/plugin-api";
import { apiAuthorization } from "../../config";

@ApplyOptions<RouteOptions>({
    route: "/vote/bot",
    name: "voteBot"
})

export class voteBotRoute extends Route {
    public async [methods.POST](request: ApiRequest, response: ApiResponse) {
        const bodyPayload = request.body as voteBodyWebhook;
        if (request.headers.authorization !== apiAuthorization) return response.status(403).json({ status: 403 });
        const user = this.container.client.users.resolve(bodyPayload.user) ?? await this.container.client.users.fetch(bodyPayload.user);
        const bot = this.container.client.users.resolve(bodyPayload.bot) ?? await this.container.client.users.fetch(bodyPayload.bot);
        const guildServer = this.container.client.guilds.cache.get("785715968608567297")!;

        const isSuccess = await (await guildServer.members.fetch(user).catch(() => undefined))?.roles.add("808197832859189311").catch(() => undefined);

        const textChannel = this.container.client.channels.cache.get("785715969561067558");
        if (this.container.client.cooldownVote.has(user.id)) return response.json({ status: 200 });
        if (textChannel && textChannel.isText()) {
            this.container.client.cooldownVote.set(user.id, true);
            this.container.tasks.create("removeCooldown", { userId: user.id }, bodyPayload.type === "test" ? 3000 : 4.32e+7);

            if (isSuccess) {
                this.container.tasks.create("removeUserRole", { roleId: "808197832859189311", guildId: "785715968608567297", userId: user.id }, bodyPayload.type === "test" ? 3000 : 4.32e+7);
            }

            await textChannel.send({
                embeds: [
                    new Embed()
                        .setTitle(`Thank you for voting for ${bot.username}#${bot.discriminator}`)
                        .setColor(15277667)
                        .setDescription(`User: \`${user.username}#${user.discriminator} (${bodyPayload.user})\` just voted on top.gg! 🎉\n${isSuccess ? `Given <@&808197832859189311> role to user as reward 🎉 [12 Hours]\n\nYou can vote on top.gg [here](https://top.gg/bot/${bot.id}/vote) every 12 hours!` : ""}`)
                        .setFooter(bodyPayload.type === "test" ? { text: "This is a test vote webhook" } : null)
                ]
            });

            return response.json({ status: 200 });
        }
    }
}

export interface voteBodyWebhook {
    user: string;
    type: "test" | "upvote";
    query?: string;
    isWeekend?: boolean;
    bot: string;
}
