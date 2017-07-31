'use strict'

module.exports = (function () {
  let typesMap = {}

  function YelpPlacesTypeMaper () {
    // TODO: Make this map come from external configuration file, not embeded in the code,
    typesMap['restaurant'] = 'restaurants'
  }

  YelpPlacesTypeMaper.prototype.getType = function (type) {
    return typesMap[type]
  }

  return YelpPlacesTypeMaper
}())
