const express = require('express');
const fs = require('fs'); //using fs-extra probably would save an import, but I am not familiar with it
//so I am sticking with what I know :D
const helper = require('./../helper.js');

const router = express.Router();

const addressesObj = JSON.parse(fs.readFileSync('././addresses.json', 'utf8'));

module.exports = router;

areaResults = [];
respStatus = 202;

//basic test route with a static response
router.get('/teste', (req, res) => {
    res.json({ teste: "ok" });
})

router.route('/cities-by-tag?*').get((req, res) => {
    console.log(`entered route: ${req.url}`)
    let splitUrl = req.originalUrl.split('cities-by-tag?');
    let tags = splitUrl[1]; //get the part after the ?
    if( tags ){
        tags = tags.split('&');
    }
    let filters = {}
    for (tag of tags) { //fill an object with the filters we want
        let pair = tag.split('=');
        let key= pair[0];
        let value = pair[1];
        filters[key] = value; 
    }
    let cities= addressesObj.filter(function(item) {
        let valid = true;
        for (const k in filters) {
            if(k != 'tag'){
                if (item[k] === undefined || (item[k].toString()) != filters[k]){
                    valid = false;
                }
            } else { //key == tag
                if (item['tags'].indexOf(filters[k]) == -1) { //couldnt find the tag
                    valid = false;
                }
                // else { console.log( 'found the tag') }
            }
        }
        return valid;
    });
    res.json({cities});
});


router.route('/distance?*').get((req, res) => {
    console.log(`entered route: ${req.url}`)
    let splitUrl = req.originalUrl.split('distance?');
    let f = splitUrl[1]; //get the part after the ?
    if( f){
        f = f.split('&');
    }
    let from = f[0].split('from=')[1];
    let fromAddress = addressesObj.find( el => el.guid == from);
    let to = f[1].split('to=')[1];
    let toAddress = addressesObj.find( el => el.guid == to);

    lat1 = fromAddress.latitude;
    lat2 = toAddress.latitude;
    lon1 = fromAddress.longitude;
    lon2 = toAddress.longitude;

    const distance = helper.distance(lat1,lon1,lat2,lon2);
    let output = { from: fromAddress,
                    to: toAddress,
                    unit: 'km',
                distance: distance}
    res.json(output);
});

router.route('/area-result/:resultUrlId').get((req, res) => {
    console.log(`entered route: ${req.url}`)
    var checkCompletion = function(){
        if(areaResults.length == 0 ) { 
            // console.log('empty')
            res.status(202)
        } else { //results are ready
            // console.log(areaResults)
            clearInterval(interval);
            let cities = areaResults;
            res.status(200)
            res.json({cities});   
        }
    };
    let interval = setInterval( checkCompletion,100);
});


router.route('/area?*').get(async (req, res) => {
    console.log(`entered route: ${req.url}`)
    areaResults = [];
    respStatus = 202;
    const requestId = 'randomIdGeneratorHere'; 
    const resultUrl = `2152f96f-50c7-4d76-9e18-f7033bd14428`; //should be random as well
    // send 202: working on it, result the results url
    console.log(`send 202 from area call, reqId: ${requestId}, requestUrl: ${resultUrl}`);
    res.status(202).json({
        // resultsUrl: `http://127.0.0.1:8080/area-result/${resultUrl}`,
        resultsUrl: `${req.protocol}://${req.get('host')}/area-result/${resultUrl}`,
        requestId: requestId});
    
    await helper.processReq(requestId, resultUrl, addressesObj,req,res);
});


router.route('/all-cities').get((req, res) => {
    console.log(`entered route: ${req.url}`)
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.write('[')
    let lastGuid = addressesObj[addressesObj.length - 1].guid;
    for (city of addressesObj){
        res.write(JSON.stringify(city));
        res.write('\n')
        if (city.guid != lastGuid) {
            res.write(',')
        } else {
            // console.log('last element, avoid the comma')
        }
        
    }
    res.write(']')
    res.end();
});