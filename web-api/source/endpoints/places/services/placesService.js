"use strict";

module.exports = (function() {

    var privateScope = new WeakMap();
    /*placesRepository,*/
    function PlacesService(thirdPartyPlacesRepositoryList) {
        privateScope.set(this, {
            placesRepository: null,
            thirdPartyPlacesRepositoryList: thirdPartyPlacesRepositoryList
        });
    }

    PlacesService.prototype.getPlacesLocatedArround = function(latitude, longitud, type) {
        
        let privateScopeContent = privateScope.get(this);

        return new Promise((resolve, reject) => {
            try {
                let places = [];
                let repositoryIndex = 0;
                let query = {
                    latitude: latitude,
                    longitud: longitud, 
                    type: type
                }

                if (privateScopeContent.thirdPartyPlacesRepositoryList.length) {
                    retriveThirdPartyPlaces(privateScopeContent.thirdPartyPlacesRepositoryList[repositoryIndex],
                                            query,
                                            onPlacesRetivedSuccesfully,
                                            onPlacesRetiveFail);
                }
                                                
                function onPlacesRetivedSuccesfully(places) {
                    if (places.length) {
                        resolve(places);
                    }
                    else
                        onPlacesRetiveFail(new Error('Do no have any registered places arrownd'));
                }

                function onPlacesRetiveFail(error) {   

                    console.log(error, '\n');

                    repositoryIndex++;

                    if (repositoryIndex < privateScopeContent.thirdPartyPlacesRepositoryList.length) {   
                                                               
                        retriveThirdPartyPlaces(privateScopeContent.thirdPartyPlacesRepositoryList[repositoryIndex],
                                                query, 
                                                onPlacesRetivedSuccesfully, 
                                                onPlacesRetiveFail);
                    }
                    else
                        resolve([]); // If there are not more providers, return an empty array of places. :( At least we try.

                    
                }
            }
            catch(error) {
                reject(error);
            }
        });
    }
    
    function retriveThirdPartyPlaces(thirdPartyPlacesRepository, query, successfullCallback, failedCallback) {

       console.log(`Trying to fetch data from ${thirdPartyPlacesRepository.getIdentifier()} - ${thirdPartyPlacesRepository.getName()} `)
  
       thirdPartyPlacesRepository.getPlacesLocatedArround(query.latitude, query.longitud, query.type)
                                .then(thirdPartyPlaces => {
                                if (successfullCallback)
                                    successfullCallback(thirdPartyPlaces); 
                                })
                                .catch(err => {
                                if (failedCallback)
                                    failedCallback(err);
                                });
       
    }

    return PlacesService;
}());