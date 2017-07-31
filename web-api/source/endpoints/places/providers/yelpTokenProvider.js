'use strict'

module.exports = (function () {
  const privateScope = new WeakMap()

  const https = require('https')
  const querystring = require('querystring')

  function YelpTokenProvider () {
    privateScope.set(this, {
      token: null,
      expirationDate: null
    })
  };

  YelpTokenProvider.prototype.getToken = function () {
    var privateScopeContent = privateScope.get(this)

    return new Promise(function (resolve, reject) {
      try {
        if (!privateScopeContent.token) { // TODO: Validate if the token is expired and generate a new one.
          generateNewToken()
            .then(tokenInfo => {
              privateScopeContent.token = tokenInfo.token
              privateScopeContent.expiratioDate = tokenInfo.expiratioDate

              resolve(privateScopeContent.token)
            })
            .catch(error => {
              reject(error)
            })
        } else { resolve(privateScopeContent.token) }
      } catch (error) {
        reject(error)
      }
    })
  }

  function generateNewToken () {
    // TODO: make this data come from external configuration file or implement an injectable provider.
    let data = querystring.stringify({
      client_id: 'LZRg7vhTthR7EMC02AS2OQ',
      client_secret: 'Yo3IFKDr9Zn8pywPoIBpSeCVlOWaLmlAXKlYi793mX8kum7LxVupRjPNeMOtJzzQ'
    })

    let requestMetadata = {
      host: 'api.yelp.com',
      port: 443,
      method: 'POST',
      path: '/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      }
    }

    return new Promise(function (resolve, reject) {
      try {
        let request = https.request(requestMetadata, function (res) {
          var entireResponse = ''
          res.on('data', chunk => entireResponse += chunk)
          res.on('end', () => {
            let yelpTokenInfo = JSON.parse(entireResponse)
            let expirationDate = new Date()
            expirationDate.setSeconds(expirationDate.getSeconds() + yelpTokenInfo.expires_in)
            resolve({
              token: yelpTokenInfo.access_token,
              expirationDate: expirationDate
            })
          })
          res.on('error', error => reject(error))
        })
        request.write(data)
        request.end()
      } catch (error) {
        reject(error)
      }
    })
  }

  return YelpTokenProvider
}())
