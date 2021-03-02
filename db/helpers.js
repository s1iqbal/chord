let defaultFilters = require('./filters.js').filters;
let filterParser = require('./parser').filterParser;

//function to sort based on key. This is used to sort the pools based on MMR so finding is easier
let GetSortOrder = (prop) =>  {    
    return function(a, b) {    
        if (a[prop] > b[prop]) {    
            return 1;    
        } else if (a[prop] < b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
}


let constructMessage = (map) => {
    if (map == undefined) return 'Map not found for that filter. Please try another filter and make sure to use full names for mods.'
    let message = [];
    message.push(`[https://osu.ppy.sh/b/${map.mapId} ${map.mapName} ★ ${map.starRating.toFixed(2)}] - MMR: ${map.mmr.toFixed(0)} - ${map.pool}`);
    message.push(`${map.mapName} [${map.difficultyName}] |⌚ ${convertTime(map.length)} | ♪ ${map.bpm} | MOD=${map.mod}`);
    return message;
}

let convertTime = (duration) => {
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

module.exports = {
    findPools: function(MMR, range = 5, pools) {
        let requestedPools = [],
            lowerMMR = MMR-range,
            upperMMR = MMR+range;
        //find pools using mmr and range where range is mmr-range to mmr+range
        //pool is already sorted beforehand so the next line is not needed anymore
        //pools.sort(GetSortOrder("averageMMR"))
         
        //find the pools for the ranges
        pools.forEach(pool => {
            if (pool.averageMMR <= upperMMR && pool.averageMMR >= lowerMMR) {
                requestedPools.push(pool);
            }
        })

        return requestedPools;
    },
    findMaps: function(pools, filters) {
        let maps = [];
        let searchableFilter = {};
      
        if (filters) {
            filters = filterParser(filters)
            let searchableFilter = {};
            for (key in filters) {
                if (filters[key] != null) {
                    searchableFilter[key] = filters[key];
                }
            };
            pools.forEach((pool)=>{
                pool.maps.forEach((map)=>{
                    //check if map meets the filter, if it does, add it. If not, then dont
                    for(key in searchableFilter) {
                        if(key == "mod") {
                            if (map[key] != searchableFilter[key]) return;
                        }
                        if(key == "starRating") {
                            if ((map[key].toFixed(2) > searchableFilter[key] + 0.1) ||
                                (map[key].toFixed(2) < searchableFilter[key] - 0.1)) return;  
                        }
                        if(key == "bpm") {
                            if (searchableFilter[key] != map[key]) return;
                        }
                      
                    }
                    maps.push(map);
                });
            });
        } else {
            pools.forEach((pool)=>{
                pool.maps.forEach((map)=>{
                    maps.push(map);
                });
            });
        }

        return maps;
    },
    findMapRandom: function(maps) {
        let map = maps[Math.floor(Math.random() * maps.length)];
        return constructMessage(map);
    },
    findMapFilteredMMR: function(maps) {
        let map = maps[Math.floor(Math.random() * maps.length)];
        //construct url to send
        return constructMessage(map);
    },
    messageMap: function(map) {
        return constructMessage(map);
    }
};