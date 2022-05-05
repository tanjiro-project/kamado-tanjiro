import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { GatewayDispatchEvents } from "discord-api-types/v9";
import { botActivity, botActivityType } from "../config";

@ApplyOptions<ListenerOptions>(({ container }) => ({
    name: GatewayDispatchEvents.Resumed,
    emitter: container.client.ws
}))

export class shardResumed extends Listener {
    public run() {
        this.container.client.user?.setActivity({
            name: botActivity,
            type: botActivityType
        });
    }
}
