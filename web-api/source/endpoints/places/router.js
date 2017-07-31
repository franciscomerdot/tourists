'use strict'

module.exports = (function () {
  var privateScope = new WeakMap()

  function PlacesRouter (placesEndpoint) {
    privateScope.set(this, placesEndpoint)
  }

  PlacesRouter.prototype.route = function (hapiServer) {
    var placesEndpoint = privateScope.get(this)

    // TODO: explain why we need to bind here.

    hapiServer.route({ method: 'GET',
      path: '/places',
      handler: placesEndpoint.getPlacesLocatedArround.bind(placesEndpoint) })  
    
    hapiServer.route({ method: 'GET',
      path: '/places/types',
      handler: placesEndpoint.getPlacesTypes.bind(placesEndpoint) })

    hapiServer.route({ method: 'GET',
      path: '/places/information/{providerIdentifier}/{placeIdentifier}',
      handler: placesEndpoint.getPlacesInformation.bind(placesEndpoint) })

    hapiServer.route({ method: 'POST',
      path: '/places/rate',
      handler: placesEndpoint.ratePlace.bind(placesEndpoint) })
  }

  return PlacesRouter
}())
