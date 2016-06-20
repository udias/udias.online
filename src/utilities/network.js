/**
 * # Utility: Network
 *
 * Communication helpers
 */

import { Client } from 'nes/client'
import WebTorrent from 'webtorrent'

if (!WebTorrent.WEBRTC_SUPPORT) {
  alert('Unfortunately it seems like yout browser doesn\'t support WebRTC yet...')
}

/**
 * Create socket instance
 *
 * @param  {string}  url -
 * @return {Promise}     -
 */
export function createSocket (url) {
  return new Promise((resolve, reject) => {
    const socket = new Socket(url)
    socket.client.connect((error) => {
      if (error) {
        return reject(error)
      }
      return resolve(socket)
    })
  })
}

/**
 * Create peer instance
 *
 * @return {Promise} -
 */
export function createPeer () {
  return new Promise((resolve) => {
    const peer = new Peer()
    peer.client.on('ready', () => resolve(peer))
    peer.client.on('error', (error) => {
      console.error(error.message)
    })
  })
}

/**
 *
 */
class Socket {

  /**
   * @param  {string} url -
   */
  constructor (url) {
    this.client = new Client(url)
  }

  /**
   * Listen for data on a channel
   *
   * @param  {string}   path     -
   * @param  {Function} handler  -
   * @param  {Function} callback -
   */
  on (path, handler, callback) {
    this.client.subscribe(path, handler, (error) => {
      if (error) {
        return console.error(error)
      }
      callback && callback()
    })
  }

  /**
   * Listen for data on a channel one time
   *
   * @param  {string}  path -
   * @return {Promise}      -
   */
  once (path) {
    return new Promise((resolve, reject) => {
      const { client } = this
      client.subscribe(path, function receive (message) {
        client.unsubscribe(path, receive, (error) => error && console.error(error))
        return resolve(message)
      }, (error) => {
        if (error) {
          return reject(error)
        }
      })
    })
  }

  /**
   * Send data through the websocket connection
   *
   * @param  {string}  path    -
   * @param  {Object}  message -
   * @return {Promise}         -
   */
  send (path, message) {
    return new Promise((resolve, reject) => {
      this.client.message({ path, message}, (error, response) => {
        if (error) {
          return reject(error)
        }
        return resolve(response)
      })
    })
  }

  /**
   * Send GET request
   *
   * @param  {string}  path -
   * @return {Promise}      -
   */
  get (path) {
    return new Promise((resolve, reject) => {
      this.client.request(path, (error, response) => {
        if (error) {
          return reject(error)
        }
        return resolve(response)
      })
    })
  }
}

/**
 *
 */
class Peer {
  constructor(){
    this.client = new WebTorrent()
    this.client.on('error', (error) => {
      console.error('WebTorrent:', error)
    })
    this.client.on('close', (msg) => {
      console.log('close', msg)
    })
  }

  /**
   * Get torrent of a source
   *
   * @param  {string}  source -
   * @return {Promise}        -
   */
  load (source) {
    return new Promise((resolve, reject) => {
      // check if torrent is already available
      const { torrents } = this.client
      const torrent = torrents.find((torrent) => torrent.infoHash === source)
      if (torrent) {
        return resolve(torrent)
      }
      // else load
      this.client.add(source, (torrent) => {
        return resolve(torrent)
      })
    })
  }

  /**
   * Distribute files
   *
   * @param  {Object}  files -
   * @return {Promise}       -
   */
  seed (files) {
    return new Promise((resolve, reject) => {
      this.client.seed(files, (torrent) => {
        return resolve(torrent)
      })
    })
  }

  /**
   * Get the buffer from a source / torrent
   *
   * @param  {string|Object} source -
   * @return {Promise}              -
   */
  read (source) {
    const getTorrent = (typeof source === 'string') ? this.load(source) : Promise.resolve(source)
    return getTorrent.then((torrent) => {
      return new Promise((resolve, reject) => {
        const [file] = torrent.files
        file.getBuffer((error, buffer) => {
          if (error) {
            return reject(error)
          }
          const extension = extname(file.path)
          if (!extension.length || extension === 'json') {
            try {
              buffer = JSON.parse(buffer.toString())
            } catch (error) {
              console.log('catch', error)
            }
          }
          if (typeof buffer === 'object') {
            buffer._source = source
          }
          return resolve(buffer)
        })
      })
    })
  }

  /**
   * Assign name/path reference
   *
   * @param  {Object} data -
   * @return {Promise}     -
   */
  write (data) {
    const vdoc = new Buffer(JSON.stringify(data))
    vdoc.name = 'virtual document'
    return this.seed(vdoc)
  }
}

/**
 * Based on diaffigys detect implementation: https://github.com/diafygi/webrtc-ips
 *
 * @return {Promise} -
 */
export function getLocalAdress(){
  return new Promise((resolve) => {
    var fullfilled = false

    const servers = {
      iceServers: [{
        urls: 'stun:stun.services.mozilla.com'
      }]
    }

    const mediaConstraints = {
      optional: [{ RtpDataChannels: true }]
    }

    const conn = new RTCPeerConnection(servers, mediaConstraints)

    const parseCandidate = (candidate) => {
      // use regex matching
      const address = (/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/).exec(candidate)[1]

      if (!fullfilled) {
        resolve(address)
      }
      fullfilled = true
    }

    conn.onicecandidate = (ice) => {
      if (ice.candidate) {
        parseCandidate(ice.candidate.candidate)
      }
    }

    conn.createDataChannel('')

    conn.createOffer(::conn.setLocalDescription, ::console.error)

    // wait to set everthing
    setTimeout(() => {
      const lines = conn.localDescription.sdp.split('\n')
      lines.forEach((line) => {
        if (line.indexOf('a=candidate:') === 0) {
          parseCandidate(line)
        }
      })
    }, 1000)
  })
}
