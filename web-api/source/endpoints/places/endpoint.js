'use strict'

module.exports = (function () {
  var privateScope = new WeakMap()

  function PlacesEndpoint (placesSearchService) {
    privateScope.set(this, placesSearchService)
  };

  PlacesEndpoint.prototype.getPlacesLocatedArround = function (request, reply) {
    let placesSearchService = privateScope.get(this)

    placesSearchService.getPlacesLocatedArround(request.query)
      .then(places => reply(places))
      .catch(error => reply(error))
  }

  return PlacesEndpoint
}())
