'use strict'

module.exports = (function () {
  var privateScope = new WeakMap()
  /* placesRepository, */
  function PlacesService (thirdPartyPlacesRepositoryList) {
    privateScope.set(this, {
      placesRepository: null,
      thirdPartyPlacesRepositoryList: thirdPartyPlacesRepositoryList,
      fetchingRespositoryIndex: 0
    })
  }

  PlacesService.prototype.getPlacesLocatedArround = function (locationQuery) {
    let privateScopeContent = privateScope.get(this)

    return new Promise((resolve, reject) => {
      try {
        let queryValidationErrors = validateQuery(locationQuery)

        if (queryValidationErrors.length) { throw new Error('bad query') } // TODO: Throw to a beter message.

        if (privateScopeContent.thirdPartyPlacesRepositoryList.length) {
          retriveThirdPartyPlaces.call(this, 0, locationQuery, resolve, reject) // TODO: explain why call and not a direct function call
        }
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
          console.log(`Data feched from ${thirdPartyPlacesRepositoryName}`)
          resolve(thirdPartyPlaces)
        } else {
          console.log(`The provider ${thirdPartyPlacesRepository.getIdentifier()} - ${thirdPartyPlacesRepository.getName()}, doesn't have places arround`)
          retriveThirdPartyPlaces.call(this, repositoryIndex, query, resolve, reject)
        }
      })
      .catch(error => {
        console.log(error);
        console.log(`Error feching data from ${thirdPartyPlacesRepositoryName} \n ${error}`)
        retriveThirdPartyPlaces.call(this, repositoryIndex, query, resolve, reject)
      })
  }

  return PlacesService
}())
