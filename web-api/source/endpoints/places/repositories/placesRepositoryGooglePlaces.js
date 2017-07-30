"use strict";

module.exports = (function() {

    const https = require('https');
    const googleApiKey = 'AIzaSyBkbiDoCgh1j1Ney1-5k_1MvDqd_iwE_lw';

    function PlacesRepositoryGooglePlaces() {}

    PlacesRepositoryGooglePlaces.prototype.getIdentifier = () => "GOOGLE_PLACES";

    PlacesRepositoryGooglePlaces.prototype.getName = () => "Google Places Repository";

    PlacesRepositoryGooglePlaces.prototype.getPlacesLocatedArround = function(latitude, longitud, type) {

        return new Promise(function(resolve, reject) {
            try
            {
                let googleRequest = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=500&location=${latitude},${longitud}&type=${type}&key=${googleApiKey}`;
                https.get(googleRequest, resp => {             
                    
                    let buffer = '';

                    resp.setEncoding('utf8');
                    resp.on('data', chunk =>  buffer += chunk)
                        .on('end',  () => {

                            let googleResponse;

                            try {
                                googleResponse = JSON.parse(buffer);
                            }
                            catch(error) {
                                reject(new Error('Can not parce the service response: \n\n' + buffer));
                                return;
                            }

                            if (googleResponse.status.toUpperCase() == "OK")
                                resolve(parseResponseToTouristModel(googleResponse));
                            else
                                reject(new Error('Can not get google places due status: ' + googleResponse.status));
                        });
                })
                .on("error", error => { reject(error) });
            }
            catch(error) {
                reject(error)
            }
        });
    }

    function parseResponseToTouristModel(googleResponse) {
        return [];
    }
         
    return PlacesRepositoryGooglePlaces;
}());