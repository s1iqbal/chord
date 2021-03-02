const https = require('https');
var fs = require('fs');
const {findPools, otherMethod, findMaps, findMapRandom} = require('./helpers');

fs.readFile('../data/pool.json', (err, data) => {
    if (err) throw err;
    let mapPools = JSON.parse(data);
    findMapRandom(
        findMaps(
            findPools(1600, 100, mapPools)
        )
    );
});


   

// https.get(`https://oma.hwc.hr/api/pools`, (resp) => {
//   let data = '';

//   // A chunk of data has been received.
//   resp.on('data', (chunk) => {
//     data += chunk;
//   });

//   // The whole response has been received. Print out the result.
//   resp.on('end', () => {
//     console.log(JSON.parse(data));
//     fs.writeFile("pool.json", data, function(err) {
//         if (err) {
//             console.log(err);
//         }
//     });
//   });

// }).on("error", (err) => {
//   console.log("Error: " + err.message);
// });