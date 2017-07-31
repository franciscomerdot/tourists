'use strict'

module.exports = (function () {
  var privateScope = new WeakMap()

  /*, placeRatingService*/
  function PlacesEndpoint (placesSearchService) {
    privateScope.set(this, {
      //placeRatingService: placeRatingService,
      placesSearchService: placesSearchService
    })
  }

  PlacesEndpoint.prototype.getPlacesTypes = function (request, reply) {
    let placesSearchService = privateScope.get(this).placesSearchService

    placesSearchService.getPlacesLocatedArround(request.query)
      .then(places => reply(places))
      .catch(error => reply(error))
  }

  PlacesEndpoint.prototype.getPlacesLocatedArround = function (request, reply) {
    let placesSearchService = privateScope.get(this).placesSearchService

    placesSearchService.getPlacesLocatedArround(request.query)
      .then(places => reply(places))
      .catch(error => reply(error))
  }

  PlacesEndpoint.prototype.getPlacesInformation = function (request, reply) {
    let placesSearchService = privateScope.get(this).placesSearchService

    placesSearchService.getPlacesLocatedArround(request.query)
      .then(places => reply(places))
      .catch(error => reply(error))
  }

  PlacesEndpoint.prototype.ratePlace = function (request, reply) {
    let placesSearchService = privateScope.get(this).placesSearchService

    placesSearchService.getPlacesLocatedArround(request.query)
      .then(places => reply(places))
      .catch(error => reply(error))
  }

  return PlacesEndpoint
}())
