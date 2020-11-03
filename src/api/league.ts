import { LolApi } from "twisted"
import { Regions } from "twisted/dist/constants";
import { riotApiKey } from "../config";

const api = new LolApi({
    key: riotApiKey,
});
 
export async function getById(id: string, region: Regions) {
    return await api.Summoner.getById(id, region);
}

export async function getActiveGame(id: string, region: Regions) {
    return await api.Spectator.activeGame(id, region);
  }

export async function getQueueInfo(queueId: number) {
    return (await api.DataDragon.getQueues()).find(queue => queue.queueId === queueId);
}
