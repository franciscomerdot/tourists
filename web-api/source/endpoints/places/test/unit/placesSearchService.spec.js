require('should')
const jemsDI = require('@jems/di')

let kernel

before((end) => {
  /**
  * Creating scenarios to perform test against them.
  */
  kernel = new jemsDI.Kernel()
  kernel.createContainer('functionalPlacesRepositories')
  kernel.getContainer('functionalPlacesRepositories').setSupportContainersAliases(['default'])
  kernel.createContainer('unfunctionalPlacesRepositories')
  kernel.getContainer('unfunctionalPlacesRepositories').setSupportContainersAliases(['default'])
  kernel.createContainer('allPlacesRepositories')
  kernel.getContainer('allPlacesRepositories').setSupportContainersAliases(['functionalPlacesRepositories']) // 'unfunctionalPlacesRepositories'

  kernel.bind('placesSearchService').to(require('../../services/placesSearchService'))
  kernel.bind('placesRepository').to(function() {
    this.getPlacesLocatedArround = function (locationQuery) {
      return new Promise(function (resolve, reject) {
        resolve([])
      })
    }
  })

  kernel.bind('thirdPartyPlacesRepository').to(function () {
    this.getIdentifier = () => 'FAIL_PLACES'
    this.getName = () => 'Test Fail Places Repository'
    this.getPlacesLocatedArround = function (locationQuery) {
      return new Promise(function (resolve, reject) {
        reject(new Error('Yai, I\'m not working, can not fect data.'))
      })
    }
  }).inContainer('unfunctionalPlacesRepositories')

  kernel.bind('thirdPartyPlacesRepository').to(function () {
    this.getIdentifier = () => 'TEST1_PLACES'
    this.getName = () => 'Test One Places Repository'
    this.getPlacesLocatedArround = function (locationQuery) {
      return new Promise(function (resolve, reject) {
        resolve([])
      })
    }
  }).inContainer('unfunctionalPlacesRepositories')

  kernel.bind('thirdPartyPlacesRepository').to(function () {
    this.getIdentifier = () => 'TEST2_PLACES'
    this.getName = () => 'Test Two Places Repository'
    this.getPlacesLocatedArround = function (locationQuery) {
      return new Promise(function (resolve, reject) {
        resolve([{
          name: 'The real place wanna be.'
        }])
      })
    }
  }).inContainer('functionalPlacesRepositories')

  end()
})

describe('The places service', () => {
  describe('When looking for places', () => {
    it('should return an empty list of places, if no repository can fectch data.', () => {
      kernel.useContainer('unfunctionalPlacesRepositories')
      let placesService = kernel.resolve('placesSearchService')

      return placesService.getPlacesLocatedArround({}).then((places) => {
        (places.length).should.be.eql(0)
      })
    })

    it('should return an one place in the list of places, because the available provider has one.', () => {
      kernel.useContainer('functionalPlacesRepositories')
      let placesService = kernel.resolve('placesSearchService')

      return placesService.getPlacesLocatedArround({}).then((places) => {
        (places.length).should.be.eql(1)
      })
    })

    it('should return an one place in the list of places, because just one provider have places and only have one.', () => {
      kernel.useContainer('allPlacesRepositories')
      let placesService = kernel.resolve('placesSearchService')

      return placesService.getPlacesLocatedArround({}).then((places) => {
        (places.length).should.be.eql(1)
      })
    })
  })
})
