# Chord Bot
> Official Tournament Map Recommender for Osu!


Chord bot is an IRC bot that responds to the user's query by supplying them an offical tournament map based on MMR and the filters provided.
I have upgraded it to use a database system instead of a local file system for every query. This ensures that theres less processing time on the server
when handling queries and allows the pools and maps to be populated or edited without restarting the service.

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
DATABASE_URL=

```
npm i
npm run dev
```


## Collaborators

| User/Name| Osu Profile |
| ------ | ------ |
| Chord | https://osu.ppy.sh/users/chord |


## License
MIT

