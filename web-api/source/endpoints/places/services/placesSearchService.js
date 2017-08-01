'use strict'

module.exports = (function () {
  var privateScope = new WeakMap()
  function PlacesService (thirdPartyPlacesRepositoryList, placesRepository) {
    privateScope.set(this, {
      placesRepository: placesRepository,
      thirdPartyPlacesRepositoryList: thirdPartyPlacesRepositoryList
    })
  }

  PlacesService.prototype.getPlacesTypes = function () {
    return new Promise(function(resolve) { resolve([{ key: 'restaurant', name: 'Restaurants', description: 'Just food.' }]) }); // TODO: Persists types in the database.
  }

  PlacesService.prototype.getPlaceInformation = function(providerIdentifier, placeIdentifier) {
    return privateScope.get(this).placesRepository.getPlaceInformation(providerIdentifier, placeIdentifier);
  }

  PlacesService.prototype.getPlacesLocatedArround = function (locationQuery) {
    let privateScopeContent = privateScope.get(this)

    return new Promise((resolve, reject) => {
      try {
        let queryValidationErrors = validateQuery(locationQuery)

        if (queryValidationErrors.length) { throw new Error('bad query') } // TODO: Throw to a beter message.

        privateScopeContent.placesRepository.getPlacesLocatedArround(locationQuery).then(places => {
        if (places.length) {
          resolve(places);
          return;
        }

        if (privateScopeContent.thirdPartyPlacesRepositoryList.length) {
          retriveThirdPartyPlaces.call(this, 0, locationQuery, resolve, reject) // TODO: explain why call and not a direct function call
        }
        }).catch((error) => { reject(error) });
      } catch (error) {
        reject(error)
      }
    })
  }

  function validateQuery (locationQuery) {
    return []
  }

  function retriveThirdPartyPlaces (repositoryIndex, query, resolve, reject) {
    let privateScopeContent = privateScope.get(this)

    if (repositoryIndex === privateScopeContent.thirdPartyPlacesRepositoryList.length) {
      if (resolve)
        resolve([])

      return
    }

    let thirdPartyPlacesRepository = privateScopeContent.thirdPartyPlacesRepositoryList[repositoryIndex]
    let thirdPartyPlacesRepositoryName = `[${thirdPartyPlacesRepository.getIdentifier()} - ${thirdPartyPlacesRepository.getName()}]`
    repositoryIndex++

    console.log(`Trying to fetch data from ${thirdPartyPlacesRepositoryName}`)

    thirdPartyPlacesRepository.getPlacesLocatedArround(query)
      .then(thirdPartyPlaces => {
        if (thirdPartyPlaces.length) {
          // console.log(`Data feched from ${thirdPartyPlacesRepositoryName}`)
          if (resolve)
            resolve(thirdPartyPlaces)

          privateScopeContent.placesRepository.savePlaces(thirdPartyPlaces).catch(error => { throw error });    
        }

        // console.log(`The provider ${thirdPartyPlacesRepository.getIdentifier()} - ${thirdPartyPlacesRepository.getName()}, doesn't have places arround`)
        retriveThirdPartyPlaces.call(this, repositoryIndex, query, thirdPartyPlaces.length || !resolve ? null : resolve, reject)        
      })
      .catch((error) => {
        console.log(`Error feching data from ${thirdPartyPlacesRepositoryName} \n ${error}`)
        retriveThirdPartyPlaces.call(this, repositoryIndex, query, resolve, reject)
      })
  }

  return PlacesService
}())
