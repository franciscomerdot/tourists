'use strict'

const fs = require('fs')

function ModuleFinder () {}

ModuleFinder.prototype.getEndpointsModules = function () {
  let endpointsPath = './endpoints/'
  let modules = []
  let directories = fs.readdirSync(endpointsPath).filter(f => fs.statSync(endpointsPath + '/' + f).isDirectory())

  directories.forEach(directory => {
    let ModuleClass

    try {
      ModuleClass = require(`${endpointsPath}${directory}/module`)
      modules.push(new ModuleClass())
    } catch (e) {

    }
  })

  return modules
}

module.exports = ModuleFinder
