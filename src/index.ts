import "dotenv/config";
import { TanjiroClient } from "./structures/TanjiroClient";
const client = new TanjiroClient();
/* eslint @typescript-eslint/no-floating-promises: "off" */
client.login();
