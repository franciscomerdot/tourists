'use strict'

import fs from 'fs'

function ModuleFinder () {}

ModuleFinder.prototype.getEndpointsModules = function () {
  let endpointsPath = './endpoints/'
  let modules = []
  let directories = fs.readdirSync(endpointsPath).filter(f => fs.statSync(endpointsPath + '/' + f).isDirectory())

  directories.forEach(directory => {
    let ModuleClass = require(`${endpointsPath}${directory}/module`)

    modules.push(new ModuleClass())
  })

  return modules
}

module.exports = ModuleFinder
