import { createClient } from "redis";
import { Match } from "../model/Match";

let lastEventNumber = 0;


export function sendMatchToFrontend(match: Match) {
    if (match.eventNumber > lastEventNumber) {
        lastEventNumber = match.eventNumber;

    }
}

export class RedisController {
    private static instance: RedisController;
    private client = createClient();
    private testClient;

    public static getInstance(): RedisController {
        if (RedisController.instance == null) RedisController.instance = new RedisController();
        return RedisController.instance;
    }

    constructor() {
        this.testClient = this.client.duplicate();
        this.testClient.subscribe("match_info", (msg, chn) => {
            console.log(`Received message from ${chn}: ${msg}`);
        });
        this.testClient.connect();

        this.client.on("error", function (error) {
            console.error(`Redis error: ${error}`);
        });
        this.client.connect();
    }

    sendMatchToFrontend(match: Match) {
        if (match.eventNumber > lastEventNumber) {
            lastEventNumber = match.eventNumber;

            console.log("Sending match to frontend");
            this.client.publish("match_info", JSON.stringify(match));
        }
    }

}