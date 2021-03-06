'use strict'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

module.exports = (function () {
  const privateScope = new WeakMap()
  const https = require('https')

  function PlacesRepositoryFourSquarePlaces (foursquarePlacesTypeMapper) {
    privateScope.set(this, {
      foursquarePlacesTypeMapper: foursquarePlacesTypeMapper
    })
  }

  PlacesRepositoryFourSquarePlaces.prototype.getIdentifier = () => 'FOUR_SQUARE'

  PlacesRepositoryFourSquarePlaces.prototype.getName = () => 'FourSquare Places Repository'

  PlacesRepositoryFourSquarePlaces.prototype.getPlacesLocatedArround = function (locationQuery) {
    let foursquarePlacesTypeMapper = privateScope.get(this).foursquarePlacesTypeMapper

    return new Promise(function (resolve, reject) {
      try {
        // TODO: Get the token from external configuration file.
        let fourSquareApiToken = 'OAW15R2ZM1K0USRULP1UQJ2MXC25ZQ1TRBXKAR2DYQE3NGFP&v=20170730'
        locationQuery.type = foursquarePlacesTypeMapper.getType(locationQuery.type)

        if (!locationQuery.type) { resolve([]) } // If there is no map for the type, we assume that don't have places of the type.              

        // TODO: Oh my good, hard code 100000, make it configurable :(, NOW ..!
        if (locationQuery.radius > 100000) {
          locationQuery.radius = 100000
        }

        let fourSquareRequest = `https://api.foursquare.com/v2/venues/search?ll=${locationQuery.latitude},${locationQuery.longitude}&radius=${locationQuery.radius}&categoryId=${locationQuery.type}&oauth_token=${fourSquareApiToken}`
        https.get(fourSquareRequest, resp => {
          let buffer = ''

          resp.setEncoding('utf8')
          resp.on('data', chunk => { buffer += chunk })
            .on('end', () => {
              let fourSquareResponse

              try {
                fourSquareResponse = JSON.parse(buffer)
              } catch (error) {
                reject(new Error('Can not parce the service response.'))
                return
              }

              if (fourSquareResponse.meta.code === 200) { resolve(parseResponseToTouristModel(fourSquareResponse, locationQuery.type)) } else { reject(new Error('Can not get FourSquare places due status: ' + fourSquareResponse.meta.errorDetail)) }
            })
        })
          .on('error', error => { reject(error) })
      } catch (error) {
        reject(error)
      }
    })
  }

  function parseResponseToTouristModel (fourSquareResponse, type) {
    return fourSquareResponse.response.venues.map(item => {
      return {
        provider: 'FOUR_SQUARE',
        id: item.id,
        name: item.name,
        type: type,
        location: {
          latitude: item.location.lat,
          longitude: item.location.lng
        },
        closeTo: item.location.formattedAddress.join(', ')
      }
    })
  }

  return PlacesRepositoryFourSquarePlaces
}())
