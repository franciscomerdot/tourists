'use strict'

const jemsDI = require('@jems/di')
const Hapi = require('hapi')
const ModuleFinder = require('./moduleFinder')

let server = new Hapi.Server()
let kernel = new jemsDI.Kernel()
let moduleFinder = new ModuleFinder()

kernel.loadModules(moduleFinder.getEndpointsModules())

let routers = kernel.resolve('routerList')
console.log(`${routers.length} routers found.`)

server.connection({ port: 8081 })

routers.forEach(function (router) {
  router.route(server)
}, this)

server.start((err) => {
  if (err) {
    throw err
  }
  console.log(`Server running at: ${server.info.uri}.`)
})
