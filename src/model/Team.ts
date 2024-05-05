import { Player } from "./Player";
import { DataTypes, IAuthedData, IFormattedKillfeed, IFormattedRoster, IFormattedScore, IFormattedScoreboard } from "./eventData";
import logging from "../util/Logging";
const Log = logging("Team");

export class Team {
    public teamName;
    public teamTricode;
    public teamUrl;

    public isAttacking: boolean = false;
    private hasHandledTeam: boolean = false;
    public roundsWon: number = 0;
    private spentThisRound: number = 0;
    private spikeState: "defused" | "detonated" | "" = "";
    private roundRecord: string[] = [];

    private players: Player[] = [];
    private playerCount = 0;

    constructor(teamName: string, teamTricode: string, teamUrl: string) {
        this.teamName = teamName;
        this.teamTricode = teamTricode.toUpperCase();
        this.teamUrl = teamUrl;
    }

    receiveTeamSpecificData(data: IAuthedData) {
        // Route data
        switch (data.type) {
            case DataTypes.ROSTER:
                this.processRosterData(data.data as IFormattedRoster);
                break;

            case DataTypes.SCOREBOARD:
                this.processScoreboardData(data.data as IFormattedScoreboard);
                break;

            case DataTypes.KILLFEED:
                this.processKillfeedData(data.data as IFormattedKillfeed);
                break;

            case DataTypes.TEAM_IS_ATTACKER:
                this.isAttacking = data.data as boolean;
                break;

            case DataTypes.SCORE:
                this.processScoreData(data.data as IFormattedScore);
                break;

            default:
                break;
        }
    }

    resetRoundSpent() {
        for (const player of this.players) {
            player.moneySpent = 0;
            player.spentMoneyThisRound = false;
        }
    }

    getSpentThisRound(): number {
        let total = 0;
        for (const player of this.players) {
            total += player.moneySpent;
        }
        return total;
    }

    spikeDetonated() {
        this.spikeState = "detonated";
    }

    spikeDefused() {
        this.spikeState = "defused";
    }

    private processRosterData(data: IFormattedRoster) {
        if (data.agentInternal == "") {
            if (this.playerCount < 5) {
                this.players.push(new Player(data));
                this.playerCount++;
            }
        } else {
            for (const player of this.players) {
                if (player.playerId === data.playerId) {
                    player.onRosterUpdate(data);
                    break;
                }
            }
        }
    }

    private processScoreboardData(data: IFormattedScoreboard) {
        for (const player of Object.values(this.players)) {
            if (player.name === data.name) {
                player.updateFromScoreboard(data);
                break;
            }
        }
        this.spentThisRound = this.getSpentThisRound();
    }

    private processKillfeedData(data: IFormattedKillfeed) {
        for (const player of Object.values(this.players)) {
            if (player.name === data.attacker) {
                player.extractKillfeedInfo(data);
                return;
            }
        }
    }

    private processScoreData(data: IFormattedScore) {
        const newWon = data.won;
        if (newWon == null) return;

        if (newWon > this.roundsWon) {

            const teamKills = this.teamKills();
            if (this.spikeState !== "") {
                this.roundRecord.push(this.spikeState);
            } else if (teamKills >= 5) {
                this.roundRecord.push("kills");
            } else {
                this.roundRecord.push("timeout");
            }
            this.roundsWon = newWon;

        } else {
            this.roundRecord.push("lost");
        }

        this.spikeState = "";
        this.resetTeamKills();
    }

    private teamKills(): number {
        let count = 0;
        for (const player of this.players) {
            count += player.killsThisRound;
        }

        return count;
    }

    private resetTeamKills() {
        for (const player of this.players) {
            player.killsThisRound = 0;
        }
    }
}
