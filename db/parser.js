let defaultFilters = require('./filters.js').filters;
let MOD = [
    'NOMOD',
    'FREEMOD',
    'HIDDEN',
    'HARDROCK',
    'DOUBLETIME',
    'TIEBREAKER'
];
module.exports = {
    filterParser: function(filterString) {
        let filterObject = defaultFilters;
        for (key in filterObject) {
            filterObject[key] = null;

        };
        let filters = filterString.split(" ");
        filters.forEach((e)=>{
            let filterString = e.toLowerCase();
            if (filterString.startsWith("mod")) {  
                let modString = e.substr(4, e.length-1);
                if (MOD.includes(modString.toUpperCase())) {
                    filterObject.mod = modString.toUpperCase();
                }
            }
            if (filterString.startsWith("stars")) {
                let modStar = Number(e.split("=")[1]).toFixed(2);
                if(modStar > 0 && modStar < 10) {
                    filterObject.starRating = modStar;
                }
            }
            if (filterString.startsWith("bpm")) {
                let bpm = Number(e.split("=")[1]).toFixed(0);
                if(bpm > 0 && bpm < 600) {
                    filterObject.bpm = bpm;
                }
            }
        })
        return filterObject;
    }
};