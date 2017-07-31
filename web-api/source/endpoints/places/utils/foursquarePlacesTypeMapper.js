'use strict'

module.exports = (function () {
  let typesMap = {}

  function FoursquarePlacesTypeMaper () {
    // TODO: Make this map come from external configuration file, not embeded in the code,
    typesMap['restaurant'] = '4d4b7105d754a06374d81259'
  }

  FoursquarePlacesTypeMaper.prototype.getType = function (type) {
    return typesMap[type]
  }

  return FoursquarePlacesTypeMaper
}())
