"use strict";

module.exports = (function() {

    let https = require('https');
    let querystring = require('querystring');

    function YelpTokenProvider() {
        privateScope.set(this, {
            token: null,
            expirationDate: null
        });
    }; 
    
    YelpTokenProvider.prototype.getToken = function() {
      
        var privateScopeContent = privateScope.get(this);
        
        if (!privateScopeContent.token) //TODO: Validate if the token is expired and generate a new one.
            
        hapiServer.route({ method: 'GET',
                           path: '/places/{latitude},{longitud}/{type}', 
                           handler: placesEndpoint.getPlacesLocatedArround.bind(placesEndpoint) }); // TODO: explain why we need to bind here. 
    }

    function generateNewToken(privateScope) {

        // TODO: make this data come from external configuration file or implement an injectable provider.
        data = querystring.stringify({
            client_id: 'LZRg7vhTthR7EMC02AS2OQ',
            client_secret: 'Yo3IFKDr9Zn8pywPoIBpSeCVlOWaLmlAXKlYi793mX8kum7LxVupRjPNeMOtJzzQ'
        });

        requestMetadata = {
            host: 'api.yelp.com',
            port: 443,
            method: 'POST',
            path: '/oauth2/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': data.length
            }
        };

        return new Promise(function(resolve, reject) {

            try
            {
                let request = https.request(requestMetadata, function (res) {
                    var entireResponse = '';
                    res.on('data', chunk => entireResponse += chunk);
                    res.on('end', () => {
                        console.log()
                    });
                    res.on('error', error => reject(error))
                });
                request.write(data);
                request.end();
            }
            catch(error) {
                reject(error);
            }
        });
    }

    return YelpTokenProvider;
}());