'use strict'

module.exports = (function () {
  const co = require('co')
  const MongoClient = require('mongodb').MongoClient

  let privateScope = new WeakMap()
  let databaseConnectionString = 'mongodb://tourists-data:27017/tourists'

  function PlacesRepositoryTourist () {}

  PlacesRepositoryTourist.prototype.getIdentifier = () => 'TOURISTS_PLACES'

  PlacesRepositoryTourist.prototype.getName = () => 'Tourists Places Repository'

  PlacesRepositoryTourist.prototype.savePlaces = function (places) {
    return co(function* () {

        let db = yield MongoClient.connect(databaseConnectionString)

        try
        {
            let touristsPlaces = db.collection('places');
            yield touristsPlaces.ensureIndex({ location: "2dsphere" })

            for (let placeIndex = 0; placeIndex < places.length; placeIndex++) {
                let place = places[placeIndex]
                let touristsPlace = yield touristsPlaces.findOne({ providers: { $elemMatch: { id: place.provider, placeId: place.id } } })

                if (!touristsPlace )
                    touristsPlace = yield getPosibleTouristsPlace(place.name, place.location.latitude, place.location.longitud, touristsPlaces)

                if (touristsPlace) {
                    mapStoredPlaceWithMatchPlace(touristsPlace, place);
                    yield touristsPlaces.updateOne({ _id: touristsPlace._id }, { $set: touristsPlace });
                } else {
                    place.providers = []
                    place.providers.push({
                        id: place.provider,
                        placeId: place.id,
                        date: new Date()
                    })
                    place.location = { type: "Point", coordinates: [parseFloat(place.location.longitud.toFixed(6)),
                                                                    parseFloat(place.location.latitude.toFixed(6))] }

                    delete place.id;
                    delete place.provider;
                    yield touristsPlaces.insertOne(place);
                }
            }
        }
        catch(error) {
            db.close()
            throw error
        }

        db.close()
    })
  }

  function validatePlaces(places) {
    places.forEach((place) => {

    });
  }

  function getPosibleTouristsPlace(name, latitude, longitud, placesCollection) {
    return new Promise(function(resolve, reject) {
        placesCollection.findOne({
            name: name,
            location : {
                $near : {
                    $geometry : {
                        type : "Point" ,
                        coordinates : [longitud, latitude]
                    },
                    $minDistance : 50
                }
            }
        }, function(error, record) {

            if (error)
                reject(error)
            else
                resolve(record)
        });
    });
  }

  function mapStoredPlaceWithMatchPlace(storedPlace, matchPlace) {        
    if (!storedPlace.providers.find(p => p.id == matchPlace.provider)) {
        storedPlace.providers.push({
            id: matchPlace.provider,
            placeId: matchPlace.id,
            date: new Date()
        });
    }
  }

  PlacesRepositoryTourist.prototype.getPlacesLocatedArround = function (locationQuery) {

    return co(function* () {
        let mongoDb = yield MongoClient.connect(databaseConnectionString)

        let touristsPlaces = mongoDb.collection('places');
        yield touristsPlaces.ensureIndex({ location: "2dsphere" })

        var places = [];
        
        yield new Promise(function(resolve, reject) {

            touristsPlaces.find({
                type: locationQuery.type,
                location : {
                    $near  : {
                        $geometry : {
                            type : "Point" ,
                            coordinates : [parseFloat(locationQuery.longitud), parseFloat(locationQuery.latitude)]
                        },
                        $maxDistance : parseFloat(locationQuery.radius)
                    }
                }
            }).forEach(function(place, error) {
                if (error) {
                    reject(error)
                }

                places.push(place)
            }, function() { resolve(places) })
        });

        return parseResponseToTouristModel(places, locationQuery.type);
    })
  }

  function parseResponseToTouristModel(touristsResponse, type) {
    return touristsResponse.map(item => {
      return {
        provider: 'TOURISTS_PLACES',
        id: item._id,
        name: item.name,
        type: type,
        location: {
          latitude: item.location.coordinates[1],
          longitud: item.location.coordinates[0]
        },
        closeTo: item.closeTo
      }
    })
  }

  return PlacesRepositoryTourist
}())



