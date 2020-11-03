import { Client, TextChannel } from "discord.js";
import { discordChannelId, discordToken, watchedPlayers } from "./config";
import { getGame } from "./leagueProvider";

const bot = new Client();
bot.login(discordToken);

bot.once('ready', async () => {
    setInterval(watcher, 20000);
    console.log("watching players!");
});

const discordChannel = getTextChannel(discordChannelId);

async function watcher() {
    for(let i = 0; i < watchedPlayers.length; i++) {
        const player = watchedPlayers[i];
        const game = await getGame(player.id, player.region);
        if(game !== undefined && player.lastGame !== game.footer?.text) {
            player.lastGame = game.footer?.text;
            discordChannel?.send(game);
        }
    }
}

function getTextChannel(id: string) {
    const channel = bot.channels.cache
    .find(channel => channel.id === id);

    if (channel === undefined) {
        console.log("Channel not found");
    } else if (channel.type !== 'text') {
        console.log("Incorrect channel");
    } else {
        return <TextChannel> channel;
    }
    return null;
}