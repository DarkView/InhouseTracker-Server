import { MatchController } from "../controller/MatchController";
import logging from "../util/Logging";
const Log = logging("EventstreamIncoming");

var HoojEventSource = require('eventsource');
let matchController = MatchController.getInstance();

export function setupEventStream() {
    // const eventStreamSource = new HoojEventSource("http://overlay.localhost:3000/stream/?channel=events", { https: { rejectUnauthorized: false } });
    // eventStreamSource.onerror = (err: any) => { Log.info(err); };
    // eventStreamSource.addEventListener("streamdeck", processStreamEvent);

    // Debug match setup
    // matchController.addMatch({type: "inhouse-tracker", name: "addMatch", groupCode: "A", team1: "TESTTEAM", team2: "Hooj", isRanked: false});
    // matchController.setRanks({type: "inhouse-tracker", name: "rankInfo", groupCode: "A", ranks: {team1: ["Iron_1", "Immortal_2", "Diamond_3", "Silver_3", "Radiant"], team2: ["Iron_3", "Diamond_1", "Ascdendant_2", "Radiant", "Ascendant_3"]}});
}

function processStreamEvent(event: any) {
    const data = JSON.parse(event.data);
    if (data.type === "inhouse-tracker") {
        if (data.name === "addMatch") {
            matchController.addMatch(data);
        } else if (data.name === "removeMatch") {
            matchController.removeMatch(data)
        } else if (data.name === "rankInfo") {
            matchController.setRanks(data);
        }
    }
}