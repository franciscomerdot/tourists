function LocationController() {

    let _locationService;

    class LocationController {
        
        constructor(locationService) {
            _locationService = locationService;
        }

        getPlacesArroundMe() {
            return _locationService.getPlacesArroundMe();
        }

        getPlacesArroundMeWithTypes(...placesTypes) {
            return __locationService.getPlacesArroundMeWithTypes(placesTypes);
        }

    }
}

module.exports = LocationController;