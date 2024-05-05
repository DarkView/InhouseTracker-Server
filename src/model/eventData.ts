import { Agents, WeaponsAndAbilities } from "../util/valorantInternalTranslator";

export interface IFormattedScoreboard {
    name: string,
    tagline: string,
    agentInternal: keyof typeof Agents,
    isAlive: boolean,
    initialShield: number,
    scoreboardWeaponInternal: keyof typeof WeaponsAndAbilities,
    currUltPoints: number,
    maxUltPoints: number,
    money: number,
    kills: number,
    deaths: number,
    assists: number
}

export interface IFormattedKillfeed {
    attacker: string,
    victim: string,
    weaponKillfeedInternal: keyof typeof WeaponsAndAbilities,
    headshotKill: boolean,
    assists: string[],
    isTeamkill: boolean
}

export interface IFormattedRoster {
    name: string,
    tagline: string,
    agentInternal: keyof typeof Agents,
    playerId: string,
    position: number,
    locked: boolean,
    rank: number,
}

export interface IFormattedRoundInfo {
    roundPhase: string,
    roundNumber: number
}

export interface IFormattedScore {
    won: number,
    lost: number
}

export interface IAuthedData {
    playerName: string,
    teamTricode: string,
    groupCode: string,
    type: string,
    timestamp: number,
    data: IFormattedScoreboard | IFormattedKillfeed | IFormattedRoster | IFormattedRoundInfo | IFormattedScore | boolean | string,
}

export interface IFormattedData {
    type: string,
    data: IFormattedScoreboard | IFormattedKillfeed | IFormattedRoster | IFormattedRoundInfo | IFormattedScore | boolean,
}

export enum DataTypes {
    SCOREBOARD = "scoreboard",
    KILLFEED = "killfeed",
    ROSTER = "roster",
    MATCH_START = "match_start",
    ROUND_INFO = "round_info",
    TEAM_IS_ATTACKER = "team_is_attacker",
    SCORE = "score",
    MAP = "map",
    SPIKE_PLANTED = "spike_planted",
    SPIKE_DETONATED = "spike_detonated",
    SPIKE_DEFUSED = "spike_defused",
    AUTH = "authenticate"
}

export function isAuthedData(data: object): data is IAuthedData {
    if ("playerName" in data && "teamName" in data && "groupCode" in data && "type" in data && "data" in data) {
        return true;
    }
    return false;
}