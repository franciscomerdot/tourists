'use strict'

module.exports = (function () {
  var privateScope = new WeakMap()

  function PlacesEndpoint (placesService) {
    privateScope.set(this, placesService)
  };

  PlacesEndpoint.prototype.getPlacesLocatedArround = function (request, reply) {
    let placesService = privateScope.get(this)

    placesService.getPlacesLocatedArround(request.query)
      .then(places => reply(places))
      .catch(error => reply(error))
  }

  return PlacesEndpoint
}())
