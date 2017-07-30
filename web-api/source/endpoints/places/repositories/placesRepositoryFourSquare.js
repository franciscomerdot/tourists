"use strict";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Food Category: 4d4b7105d754a06374d81259

module.exports = (function() {

    const https = require('https');
    const fourSquareApiToken = 'OAW15R2ZM1K0USRULP1UQJ2MXC25ZQ1TRBXKAR2DYQE3NGFP&v=20170730';

    function PlacesRepositoryFourSquarePlaces() {}

    PlacesRepositoryFourSquarePlaces.prototype.getIdentifier = () => "FOUR_SQUARE";

    PlacesRepositoryFourSquarePlaces.prototype.getName = () => "FourSquare Places Repository";

    PlacesRepositoryFourSquarePlaces.prototype.getPlacesLocatedArround = function(latitude, longitud, type) {

        return new Promise(function(resolve, reject) {
            try
            {
                let fourSquareRequest = `https://api.foursquare.com/v2/venues/search?ll=${latitude},${longitud}&radius=50&categoryId=${type}&oauth_token=${fourSquareApiToken}`;
                https.get(fourSquareRequest, resp => {             
                    
                    let buffer = '';

                    resp.setEncoding('utf8');
                    resp.on('data', chunk =>  buffer += chunk)
                        .on('end',  () => {

                            let fourSquareResponse;
                            
                            try {
                                fourSquareResponse = JSON.parse(buffer);
                            }
                            catch(error) {
                                reject(new Error('Can not parce the service response.'));
                                return;
                            }

                            if (fourSquareResponse.meta.code == 200)
                                resolve(parseResponseToTouristModel(fourSquareResponse));
                            else
                                reject(new Error('Can not get FourSquare places due status: ' + fourSquareResponse.meta.errorDetail));
                        });
                })
                .on("error", error => { reject(error) });
            }
            catch(error) {
                reject(error)
            }
        });
    }

    function parseResponseToTouristModel(fourSquareResponse) {
        console,log(fourSquareResponse);
        return [];
    }
         
    return PlacesRepositoryFourSquarePlaces;
}());