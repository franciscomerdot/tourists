"use strict";

module.exports = (function() {

    var privateScope = new WeakMap();

    function PlacesEndpoint(placesService) {
        privateScope.set(this, placesService);
    }; 

    PlacesEndpoint.prototype.getPlacesLocatedArround = function(request, reply) {

        let placesService = privateScope.get(this);

        placesService.getPlacesLocatedArround(request.params.latitude, request.params.longitud, request.params.type)
                     .then(places => reply(JSON.stringify(places)))
                     .catch(error => reply(error));    
    }

    return PlacesEndpoint;
}());