"use strict";

module.exports = (function() {

    const yelp = require('yelp-fusion');

    function YelpTokenProviderThirdParty() {}

    YelpTokenProviderThirdParty.prototype.getToken = function() {

        // TODO: make this data come from external configuration file or implement an injectable provider.
        let clientId = 'LZRg7vhTthR7EMC02AS2OQ';
        let clientSecret = 'Yo3IFKDr9Zn8pywPoIBpSeCVlOWaLmlAXKlYi793mX8kum7LxVupRjPNeMOtJzzQ';

        return new Promise(function(resolve, reject) {
            yelp.accessToken(clientId, clientSecret).then(response => {
                resolve(response.jsonBody.access_token);
            }).catch(error => {
                reject(error);
            });
        });
    }

    return YelpTokenProviderThirdParty;
}())