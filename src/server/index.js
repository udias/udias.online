/**
 * # Server
 *
 *
 */

import 'babel-polyfill'

import { EventEmitter } from 'events'
import { resolve as resolvePath } from 'path'

import glob from 'glob'
import Hapi, { Server } from 'hapi'

const config = {
  host: __DEVELOPMENT__ ? 'localhost' : 'udias.online',
  port: __DEVELOPMENT__ ? 8000 : 8000,
  files: resolvePath(__dirname, '../client')
}

const server = new Server({/** options **/})

server.connection({
  host: config.host,
  port: config.port,
  routes: {
    cors: {
      origin: ['*']
    }
  }
})

// socket message delegation from clients
server.messenger = new EventEmitter()

server.register([
  require('inert'), // static files
  {
    register: require('nes'),
    options: {
      onDisconnection: (socket) => server.messenger.emit('disconnect', socket),
      onMessage (socket, message, next) {
        server.messenger.emit(message.path, socket, message.message)
        next()
      }
    }
  }
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
        index: __DEVELOPMENT__,
        lookupCompressed: true
      }
    }
  })

  // server single HTML - client routing only
  server.ext('onPreResponse', (req, reply) => {
    const response = req.response
    if (response.isBoom && response.output.statusCode === 404) {
      return reply.file(`${config.files}/index.html`).code(200)
    }
    return reply.continue()
  })


  // load routes
  glob('./routes/**.js', { cwd: __dirname }, (error, matches) => {
    if (error) {
      return console.error(error)
    }

    matches.forEach((route) => require(route)(server))

    server.start((error) => {
      if (error) {
        return console.error(error)
      }
      console.log(`[READY] - ${server.info.uri}`)
    })
  })

})
