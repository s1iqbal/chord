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

//record of the execution times of the most recent n executions
const MESSAGE_CAP = 10; //max number of messages that can be sent within the window
const WINDOW = 5; //time frame for rate limiting (in seconds)
var lastEx = []; //want to store last MESSAGE_CAP+1 execs

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
                        if(!canExecute(1)) return;
                        return await user.sendMessage(`Hello, ${user.ircUsername}`).then(logExec());
                    case prefix + "help":
                    case prefix + "commands":
                        if (!canExecute(2)) return;
                        await user.sendMessage(`!r (MMR) stars=(1-10) bpm=(50-300) mod=(hardrock, hidden, doubletime, freemod, nomod, tiebreaker)`).then(logExec())
                        return await user.sendMessage(`THE MMR IS REQUIRED RIGHT AFTER !r Example: "!r 1500 mod=hardrock stars=4.52 bpm=93`).then(logExec());;
                    case prefix + "request" :
                    case prefix + "r":
                        //send the command to a filter to process
                        if (filters.length == 2 && typeof(+filters[1])=="number") {
                            if (+filters[1] < 1150 || +filters[1] > 3300) {
                                if (!canExecute(1)) return;
                                await user.sendMessage('Please enter an MMR between 1150-3300').then(logExec());
                                return;
                            }
                            message = findMapFilteredMMR(
                                findMaps(
                                    findPools(+filters[1], 50, mapPools)
                                )
                            );
                            //Record the execution time after each message is sent
                            if (!canExecute(2)) return;
                            await Promise.all([user.sendMessage(message[0]), logExec(), user.sendMessage(message[1]), logExec()]);
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
                                    await user.sendMessage(m).then(logExec());
                                } else {
                                    // await user.sendMessage(`MMR: ${+filters[1]-50}-${+filters[1]+50}`);
                                    if (!canExecute(2)) return;
                                    await Promise.all([user.sendMessage(m[0]), logExec(), user.sendMessage(m[1]), logExec()]);
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
                            if (!canExecute(3)) return;
                            await Promise.all([user.sendMessage(m0), logExec(), user.sendMessage(message[0])], logExec(), user.sendMessage(message[1]), logExec());
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

//determine if [needed] amount of messages can be appended to logExec without violating window length limit
let canExecute = (needed) =>{
    //if lastEx has not grown enough yet, can always execute
    if(needed>lastEx.length) return true;

    var time = Date.now()/1000; //curr time in seconds
    //lastEx[needed-1] will become the starting time of the window after adding new executions
    var span = time - lastEx[needed-1];
    
    //log when window exceeded
    if(span<WINDOW) console.log("Warning: Message rate limit exceeded!");

    return span>WINDOW; //can execute if the time span is greater than the minimum accepted WINDOW
}

//FIXME: could be moved to helpers.js? idk
let logExec = () => {
    //get time in seconds
    var time = Date.now()/1000;

    //if lastEx list already at cap of executions
    if(lastEx.length>=MESSAGE_CAP+1) lastEx=lastEx.slice(-1*(MESSAGE_CAP)); //narrow down list to only the most recent n executions
    lastEx.push(time); //push new exec time   
}