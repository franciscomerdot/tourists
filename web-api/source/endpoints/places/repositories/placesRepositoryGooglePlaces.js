'use strict'

module.exports = (function () {
  const privateScope = new WeakMap()
  const https = require('https')

  function PlacesRepositoryGooglePlaces (googlePlacesTypeMapper) {
    privateScope.set(this, {
      googlePlacesTypeMapper: googlePlacesTypeMapper
    })
  }

  PlacesRepositoryGooglePlaces.prototype.getIdentifier = () => 'GOOGLE_PLACES'

  PlacesRepositoryGooglePlaces.prototype.getName = () => 'Google Places Repository'

  PlacesRepositoryGooglePlaces.prototype.getPlacesLocatedArround = function (locationQuery) {
    let googlePlacesTypeMapper = privateScope.get(this).googlePlacesTypeMapper

    return new Promise(function (resolve, reject) {
      try {
        // TODO: Get the api key from external configuration file.
        let googleApiKey = 'AIzaSyBkbiDoCgh1j1Ney1-5k_1MvDqd_iwE_lw'
        locationQuery.type = googlePlacesTypeMapper.getType(locationQuery.type)

        if (!locationQuery.type) { resolve([]) } // If there is no map for the type, we assume that don't have places of the type.

        // TODO: Oh my good, hard code 50000, make it configurable :(, NOW ..!
        if (locationQuery.radius > 50000) 
          locationQuery.radius = 50000

        let googleRequest = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=${locationQuery.radius}&location=${locationQuery.latitude},${locationQuery.longitud}&type=${locationQuery.type}&key=${googleApiKey}`

        https.get(googleRequest, resp => {
          let buffer = ''

          resp.setEncoding('utf8')
          resp.on('data', chunk => { buffer += chunk })
            .on('end', () => {
              let googleResponse

              try {
                googleResponse = JSON.parse(buffer)
              } catch (error) {
                reject(new Error('Can not parce the service response: \n\n' + buffer))
                return
              }

              if (googleResponse.status.toUpperCase() === 'OK') { resolve(parseResponseToTouristModel(googleResponse)) } else { reject(new Error('Can not get google places due status: ' + googleResponse.status)) }
            })
        })
          .on('error', error => { reject(error) })
      } catch (error) {
        reject(error)
      }
    })
  }

  function parseResponseToTouristModel (googleResponse) {
    return googleResponse.results.map(item => {
      return {
        provider: 'GOOGLE_PLACES',
        id: item.id,
        name: item.name,
        isOpen: item.opening_hours ? item.opening_hours.open_now : undefined,
        location: {
          latitude: item.geometry.location.lat,
          longitud: item.geometry.location.lng
        },
        closeTo: item.vicinity
      }
    })
  }

  return PlacesRepositoryGooglePlaces
}())
