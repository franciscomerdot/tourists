'use strict'

module.exports = (function () {
  var privateScope = new WeakMap()
  /* placesRepository, */
  function PlacesService (thirdPartyPlacesRepositoryList) {
    privateScope.set(this, {
      placesRepository: null,
      thirdPartyPlacesRepositoryList: thirdPartyPlacesRepositoryList
    })
  }

  PlacesService.prototype.getPlacesLocatedArround = function (locationQuery) {
    let privateScopeContent = privateScope.get(this)

    return new Promise((resolve, reject) => {
      try {
        let queryValidation = validateQuery(locationQuery)

        if (queryValidation.length) { throw new Error('bad query') }

        let places = []
        let repositoryIndex = 0

        if (privateScopeContent.thirdPartyPlacesRepositoryList.length) {
          retriveThirdPartyPlaces(privateScopeContent.thirdPartyPlacesRepositoryList[repositoryIndex],
            locationQuery,
            onPlacesRetivedSuccesfully,
            onPlacesRetiveFail)
        }

        function onPlacesRetivedSuccesfully (places) {
          if (places.length) {
            resolve(places)
          } else { onPlacesRetiveFail(new Error('Do no have any registered places arrownd')) }
        }

        function onPlacesRetiveFail (error) {
          console.log(error)

          repositoryIndex++

          if (repositoryIndex < privateScopeContent.thirdPartyPlacesRepositoryList.length) {
            retriveThirdPartyPlaces(privateScopeContent.thirdPartyPlacesRepositoryList[repositoryIndex],
              locationQuery,
              onPlacesRetivedSuccesfully,
              onPlacesRetiveFail)
          } else { resolve([]) } // If there are not more providers, return an empty array of places. :( At least we try.
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  function validateQuery (locationQuery) {
    return []
  }

  function retriveThirdPartyPlaces (thirdPartyPlacesRepository, query, successfullCallback, failedCallback) {
    console.log(`Trying to fetch data from ${thirdPartyPlacesRepository.getIdentifier()} - ${thirdPartyPlacesRepository.getName()} `)

    thirdPartyPlacesRepository.getPlacesLocatedArround(query)
      .then(thirdPartyPlaces => {
        if (successfullCallback) { successfullCallback(thirdPartyPlaces) }
      })
      .catch(err => {
        if (failedCallback) { failedCallback(err) }
      })
  }

  return PlacesService
}())
