# Chord Bot
> Official Tournament Map Recommender for Osu!


Chord bot is an IRC bot that responds to the user's query by supplying them an offical tournament map based on MMR and the filters provided.


## Commands

- !r (mmr) 
    - Example: "!r 1500" . 
- !r (mmr) stars=(1-10) bpm=(50-300) mod=(hardrock, hidden, doubletime, freemod, nomod)
    - Example: "!r 1500 mod=hardrock stars=4.52 bpm=93" . Selects a pool with that mmr and recommends a song




This text you see here is *actually- written in Markdown! To get a feel
for Markdown's syntax, type some text into the left window and
watch the results in the right.


## Installation

Create a .env file in the root directory with the following key value pairs
```
touch .env
```

IRC_USERNAME=
IRC_PASSWORD=

and use the irc values for your account to have the bot running locally.

You can then install the node modules and run the bot locally.
```
npm i
npm run dev
```
## TODO

| Priority | Task | Explanation |
| ------ | ------ | ------ |
|1| Global Rate Limiter| Have a global rate limiter that corrosponds to Bancho's rate limits for 10 message per 5 secs |
|2| Spam Filter for User | Have a spam filter that uses a database and time stamps to limit each user request. |
|3| Better Filters| Ability to filter MMR, star rating, and BPM by range. (Example: bpm>20<10 would search between 10 and 20) |




## Collaborators

| User/Name| Osu Profile |
| ------ | ------ |
| Chord | https://osu.ppy.sh/users/12467741 |


## License

MIT

**Free Software, Hell Yeah!**

