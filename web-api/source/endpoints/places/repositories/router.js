'use strict'

module.exports = (function () {
  var privateScope = new WeakMap()

  function PlacesRouter (placesEndpoint) {
    privateScope.set(this, placesEndpoint)
  };

  PlacesRouter.prototype.route = function (hapiServer) {
    var placesEndpoint = privateScope.get(this)

    hapiServer.route({ method: 'GET',
      path: '/places/{latitude},{longitud}/{type}',
      handler: placesEndpoint.getPlacesLocatedArround.bind(placesEndpoint) }) // TODO: explain why we need to bind here. 
  }

  return PlacesRouter
}())
