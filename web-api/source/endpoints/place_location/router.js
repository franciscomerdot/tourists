"use strict";

module.exports = (function() {

    var privateScope = new WeakMap()

    function PlaceLocationRouter(locationEndpoint) {
        privateScope.set(this, locationEndpoint);
    }; 

    PlaceLocationRouter.prototype.route = function(hapiServer) {

        let locationEndpoint = privateScope.get(this);

        hapiServer.route({ method: 'GET', path: '/placelocation/{type}', handler: locationEndpoint.getPlacesAround });        
    }

    return PlaceLocationRouter;
}());