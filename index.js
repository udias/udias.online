/**
 * # Index
 *
 * Simple webserver for handling static file hosting
 */

global.__DEVELOPMENT__ = !((process.env.NODE_ENV === 'production') || process.argv.length > 2)

require('babel-polyfill')

const path = require('path')
const glob = require('glob')
const Hapi = require('hapi')

const resolvePath = path.resolve

const config = {
  host: __DEVELOPMENT__ ? 'localhost' : 'udias.online',
  port: __DEVELOPMENT__ ? 8000 : 63452,
  files: resolvePath(__dirname, './dist')
}

const server = new Hapi.Server({/** options **/})

server.connection({
  host: config.host,
  port: config.port,
  routes: {
    cors: {
      origin: ['*']
    }
  }
})

 server.register([
   require('inert')
 ], (error) => {
   if (error) {
     throw error
   }

   // serve files
   server.route({
     method: 'GET',
     path: '/{path*}',
     handler: {
       directory: {
         path: config.files,
         listing: __DEVELOPMENT__,
         index: true,
         lookupCompressed: true
       }
     }
   })

   // serve single template file
   server.ext('onPreResponse', (req, reply) => {
     const response = req.response
     if (response.isBoom && response.output.statusCode === 404) {
       return reply.file(`${config.files}/index.html`).code(200)
     }
     return reply.continue()
   })


   server.start((error) => {
     if (error) {
       return console.error(error)
     }
     console.log(`[READY] - ${server.info.uri}`)
   })
 })
