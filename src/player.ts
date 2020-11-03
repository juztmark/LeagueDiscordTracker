import { EmbedField } from "discord.js";
import { Regions } from "twisted/dist/constants";

export interface Player {
    id: string,
    region: Regions,
    lastGame?: string
}