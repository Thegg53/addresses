module.exports = {distance: distanceFromCoords,
                processReq: processRequest};

function distanceFromCoords(lat1,lon1, lat2,lon2){
 // source: https://www.movable-type.co.uk/scripts/latlong.html
 const R = 6371e3; // metres
 const φ1 = lat1 * Math.PI/180; // φ, λ in radians
 const φ2 = lat2 * Math.PI/180;
 const Δφ = (lat2-lat1) * Math.PI/180;
 const Δλ = (lon2-lon1) * Math.PI/180;
 
 const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
           Math.cos(φ1) * Math.cos(φ2) *
           Math.sin(Δλ/2) * Math.sin(Δλ/2);
 const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
 
 const d = R * c; // in metres
 const km = d / 1000;
 const distance = Number((Math.round(km * 100) / 100).toFixed(2));
 return distance;
}


async function processRequest(requestId,resultUrlId, addressesObj, req,res) {
    console.log(`processing request ${requestId}`)
    // Processing request 
    let splitUrl = req.originalUrl.split('area?');
    let f = splitUrl[1]; //get the part after the ?
    if( f){
        f = f.split('&');
    }
    let from = f[0].split('from=')[1];
    let fromAddress = addressesObj.find( el => el.guid == from);
    let dString = f[1].split('distance=')[1];
    let distance = Number(dString)
    // console.log(`fromAddress guid: ${fromAddress.guid}    distance: ${distance}`);

    //find the cities within the specified distance
    let cities = addressesObj.filter( el => {
        return (el.guid != fromAddress.guid &&  //remove self, was getting 16 results instead of 15 :(
            distanceFromCoords(fromAddress.latitude, 
            fromAddress.longitude, 
            el.latitude, el.longitude) < distance )
    });
    areaResults = cities;
    respStatus = 200;
}