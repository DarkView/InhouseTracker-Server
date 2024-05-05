import { Match } from "../model/Match";
import { IAuthedData, isAuthedData } from "../model/eventData";
import logging from "../util/Logging";
const Log = logging("MatchController");

export class MatchController {
    private static instance: MatchController;

    private matches: Record<string, Match | null> = {};

    private constructor() {};

    public static getInstance(): MatchController{
        if (MatchController.instance == null) MatchController.instance = new MatchController();
        return MatchController.instance;
    }

    addMatch(data: any ) {
        const newMatch = new Match(data.groupCode, data.leftTeam, data.rightTeam);
        this.matches[data.groupCode] = newMatch;

        Log.info(`New match "${newMatch.groupCode}" registered!`);
    }
    
    removeMatch(data: any) {
        if (this.matches[data.groupCode]) {
            delete this.matches[data.groupCode];
            Log.info(`Removed match ${data.groupCode}!`);
        }
    }

    setRanks(data: any) {
        if (this.matches[data.groupCode] != null ) {
            this.matches[data.groupCode]!.setRanks(data);
        }
    }

    createMatchFromLogon(data: any) {
        if (this.matches[data.groupCode] != null) {
            return false;
        }

        this.addMatch(data);
        return true;
    }

    receiveMatchData(data: IAuthedData) {
        data.timestamp = Date.now();
        const trackedMatch = this.matches[data.groupCode];
        if (trackedMatch == null) {
            // How did we even get here?
            Log.info(`Received match data with invalid game "${data.groupCode}"`);
            return;
        }

        trackedMatch.receiveMatchSpecificData(data)
    }

}