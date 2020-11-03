import { MessageEmbed } from "discord.js";
import { GameTypes, Regions } from "twisted/dist/constants";
import { getActiveGame, getById, getQueueInfo } from "./api/league";

const blueTeamId = 100;
const redTeamId = 200;

export async function getGame(id: string, region: Regions) {
    const call = await getActiveGame(id, region);  

    if("response" in call) {
        const response = call.response;
        const { response: { profileIconId, name } } = await getById(id, region);
        const queueInfo =  await getQueueInfo(response.gameQueueConfigId);

        if(response.gameType == GameTypes.CUSTOM_GAME || response.gameType == GameTypes.TUTORIAL_GAME){
            return new MessageEmbed()
            .setAuthor(name, getProfilePicture(profileIconId))
            .setTitle(capitalize(response.gameType.replace("_", " ")))
            .setDescription(response.gameMode.charAt(0) + response.gameMode.slice(1).toLowerCase() + " Game")
            .setColor('PURPLE')
            .setTimestamp(new Date())
            .setFooter(response.gameId)
        }

        const redTeam = response.participants.filter(player => player.teamId === redTeamId);
        const blueTeam = response.participants.filter(player => player.teamId === blueTeamId);

        return new MessageEmbed()
        .setAuthor(name, getProfilePicture(profileIconId))
        .setTitle(queueInfo?.description?.replace(" games", ""))
        .setDescription(queueInfo?.map)
        .setColor('YELLOW')
        .setTimestamp(new Date())
        .addFields(
            { name: 'Red', value: `${redTeam.map(player => player.summonerName).join("\n")}`, inline: true },
            { name: 'Blue', value: `${blueTeam.map(player => player.summonerName).join("\n")}`, inline: true }
        )
        .setFooter(response.gameId);
    }
}

function capitalize(input: string) {
    return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
function getProfilePicture(profileIconId: number) {
    return `http://ddragon.leagueoflegends.com/cdn/10.22.1/img/profileicon/${profileIconId}.png`
}