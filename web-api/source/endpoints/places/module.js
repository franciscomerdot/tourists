"user strict";

/**
 * Represents a the places  module, that register all the assets the module needs to work properly.
 */
module.exports = (function() {

    function PlacesModule() {}
    
    /**
     * Initialize the module and bind all the build-in implementations.
     * 
     * @param {Kernel} kernel Represents the kernel that is loading the module.
     */
    PlacesModule.prototype.initialize = function(kernel) {

        kernel.bind('router').to(require('./router'));

        kernel.bind('placesEndpoint').to(require('./endpoint'));

        kernel.bind('placesService').to(require('./services/placesService'));

        BindImplementedRepositories(kernel);
    }

    /**
     * Bind the implemented repositories.
     */
    function BindImplementedRepositories(kernel) {
        
        kernel.bind('placesRepository').to(require('./repositories/placesRepositoryTourists'));
        
        kernel.bind('thirdPartyPlacesRepository').to(require('./repositories/placesRepositoryGooglePlaces'));
        kernel.bind('thirdPartyPlacesRepository').to(require('./repositories/placesRepositoryFourSquare'));
        //kernel.bind('thirdPartyPlacesRepository').to(require('./repositories/placesRepositoryYelp'));
    }

    return PlacesModule;
}());;