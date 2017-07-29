"user strict";

/**
 * Represents a the place location module, that register all the assets the module needs to work properly.
 */
module.exports = (function() {

    function PlaceLocationModule() {}
    
    /**
     * Initialize the module and bind all the build-in implementations.
     * 
     * @param {Kernel} kernel Represents the kernel that is loading the module.
     */
    PlaceLocationModule.prototype.initialize = function(kernel) {

        kernel.bind('router').to(require('./router'));

        kernel.bind('locationEndpoint').to(require('./endpoint'));

        kernel.bind('locationService').to(require('./services/locationService'));

        BindImplementedRepositories(kernel);
    }

    /**
     * Bind the implemented repositories.
     */
    function BindImplementedRepositories(kernel) {
        kernel.bind('locationRepository').to(require('./repositories/locationRepositoryTourists'));

        kernel.bind('thirdPartyLocationRepository').to(require('./repositories/locationRepositoryGooglePlaces'));
        kernel.bind('thirdPartyLocationRepository').to(require('./repositories/locationRepositoryFourSquare'));
        kernel.bind('thirdPartyLocationRepository').to(require('./repositories/locationRepositoryYelp'));
    }

    return PlaceLocationModule;
}());;