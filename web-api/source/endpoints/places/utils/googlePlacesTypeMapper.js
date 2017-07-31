"use strict";

module.exports = (function() {

    let typesMap = {};

    function GooglePlacesTypeMaper() {
        //TODO: Make this map come from external configuration file, not embeded in the code,
        typesMap['restaurant'] = 'restaurant';
    }

    GooglePlacesTypeMaper.prototype.getType = function(type) {
        return typesMap[type];
    }

    return GooglePlacesTypeMaper;
}());