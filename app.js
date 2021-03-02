const Banchojs = require("bancho.js");
const fs = require('fs');
require('dotenv').config();
const {findPools, findMaps, findMapRandom, findMapFilteredMMR} = require('./db/helpers');

const express = require('express');
const app = express();
app.set('port', (process.env.PORT || 5000));

console.log(process.env.IRC_USERNAME)
app.get('/', function(request, response) {
    response.send('App is running');
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
    startOsuBot();
});


const client = new Banchojs.BanchoClient({
    username: process.env.IRC_USERNAME,
    password: process.env.IRC_PASSWORD
});

const prefix = "!";

const startOsuBot = async () => {
    //connect to bancho
    try {
        console.log("osu!bot connecter...");
        fs.readFile('./data/updatedPool.json', async (err, data) => {
            let mapPools = JSON.parse(data);
            await client.connect();
            client.on("PM", async ({message, user}) => {
                // Check if message sent was by ourselves.
                if(user.ircUsername === process.env.IRC_USERNAME) return;
                console.log(`USER: '${user.ircUsername}'\nMESSAGE: '${message}'\n`)
                // Check for command prefix
                if(message[0] !== prefix) return;
                const command = message.split(" ")[0].toLowerCase();
                const filters = message.split(" ");
                switch(command) {
                    case prefix + "hello":
                        return await user.sendMessage(`Hello, ${user.ircUsername}`);
                    case prefix + "help":
                    case prefix + "commands":
                        await user.sendMessage(`!r (MMR) stars=(1-10) bpm=(50-300) mod=(hardrock, hidden, doubletime, freemod, nomod, tiebreaker)`)
                        return await user.sendMessage(`THE MMR IS REQUIRED RIGHT AFTER !r Example: "!r 1500 mod=hardrock stars=4.52 bpm=93`);;
                    case prefix + "request" :
                    case prefix + "r":
                        //send the command to a filter to process
                        if (filters.length == 2 && typeof(+filters[1])=="number") {
                            if (+filters[1] < 1150 || +filters[1] > 3300) {
                                await user.sendMessage('Please enter an MMR between 1150-3300');
                                return;
                            }
                            message = findMapFilteredMMR(
                                findMaps(
                                    findPools(+filters[1], 50, mapPools)
                                )
                            );
                            await Promise.all([user.sendMessage(message[0]), user.sendMessage(message[1])]);
                            return;
                        } else if (filters.length > 2) {
                            //find mmr
                            if(/^\d+$/.test(filters[1])) {
                                let m = findMapFilteredMMR(
                                    findMaps(
                                        findPools(+filters[1], 50, mapPools), message
                                    )
                                )
   
                                if (typeof m === 'string') {
                                    await user.sendMessage(m);
                                } else {
                                    // await user.sendMessage(`MMR: ${+filters[1]-50}-${+filters[1]+50}`);
                                    await Promise.all([user.sendMessage(m[0]), user.sendMessage(m[1])]);
                                }
                                return;
                            }
                        } else {
                            let mmr = Math.floor(Math.random() * (3300 - 1150 + 1) + 1150);
                            let range = 50;
                            message = findMapRandom(
                                findMaps(
                                    findPools(mmr, range, mapPools)
                                )
                            );
                            let m0 = `Random MMR Selected - MMR: ${mmr-range} - ${mmr+range} - Please use !r 1150 to request a map with 1150 mmr. Use !commands to view more`;
                            await Promise.all([user.sendMessage(m0), user.sendMessage(message[0])], user.sendMessage(message[1]));
                            return;
                        }
                }
            });
            if (err) console.error(err);

        });
    } catch(err) {
        console.error(err);
    }
}