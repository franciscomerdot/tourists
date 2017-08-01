'use strict'

module.exports = (function () {
  const privateScope = new WeakMap()
  const yelp = require('yelp-fusion')

  function PlacesRepositoryYelpPlaces (yelpTokenProvider, yelpPlacesTypeMapper) {
    privateScope.set(this, {
      yelpTokenProvider: yelpTokenProvider,
      yelpPlacesTypeMapper: yelpPlacesTypeMapper
    })
  }

  PlacesRepositoryYelpPlaces.prototype.getIdentifier = () => 'YELP'

  PlacesRepositoryYelpPlaces.prototype.getName = () => 'Yelp Places Repository'

  PlacesRepositoryYelpPlaces.prototype.getPlacesLocatedArround = function (locationQuery) {
    let yelpTokenProvider = privateScope.get(this).yelpTokenProvider
    let yelpPlacesTypeMapper = privateScope.get(this).yelpPlacesTypeMapper

    return new Promise(function (resolve, reject) {
      try {
        locationQuery.type = yelpPlacesTypeMapper.getType(locationQuery.type)

        if (!locationQuery.type) { resolve([]) } // If there is no map for the type, we assume that don't have places of the type.

        let request = {
          latitude: locationQuery.latitude,
          longitude: locationQuery.longitud,
          categories: locationQuery.type,
          radius: locationQuery.radius < 40000 ? locationQuery.radius : 4000 // TODO: Oh my good, hard code 40000, make it configurable :(, NOW ..!
        }

        yelpTokenProvider
          .getToken()
          .then(token => {
            let client = yelp.client(token)
            client.search(request).then(response => {
              let firstResult = response.jsonBody.businesses[0]
              let prettyJson = JSON.stringify(firstResult, null, 4)

              resolve(parseResponseToTouristModel(prettyJson))
            })
              .catch(error => reject(error))
          })
          .catch(error => reject(error))
      } catch (error) {
        reject(error)
      }
    })
  }

  function parseResponseToTouristModel (yelpResponse) {
    return []
  }

  return PlacesRepositoryYelpPlaces
}())
