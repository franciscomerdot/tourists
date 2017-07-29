"use strict";

module.exports = (function() {

    var privateScope = new WeakMap()

    function PlaceLocationEndpoint(locationService) {
        privateScope.set(this, locationService);
    }; 

    PlaceLocationEndpoint.prototype.getPlacesAround = function(request, reply) {

        let locationService = privateScope.get(this);

        reply('everithing is good, ' + JSON.stringify(request.params));       
    }

    return PlaceLocationEndpoint;
}());