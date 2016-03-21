/**
 * # App
 *
 *
 */

import React, { Component, PropTypes } from 'react'
import Loader from 'react-loader'
import { connect } from 'react-redux'

import { createSocket, createPeer } from '../utilities/network'

import { setSocket, setPeer } from '../redux/modules/instances'
import { updateAddress } from '../redux/modules/connection'
import {
  updateTypes,
  updateGlobalEntries,
  updateLocalEntries
} from '../redux/modules/socket'

import Header from './Header/Header'
import Main from './Main/Main'
import Footer from './Footer/Footer'
import Modal from './Modal/Modal'

import __ from './App.styl'


@connect(null, (dispatch) => ({
  updateConnectionAddress: (address) => dispatch(updateAddress(address)),
  updateSocketTypes: (types) => dispatch(updateTypes(types)),
  updateSocketGlobalEntries: (entries) => dispatch(updateGlobalEntries(entries)),
  updateSocketLocalEntries: (entries) => dispatch(updateLocalEntries(entries)),
  setInstanceSocket: (socket) => dispatch(setSocket(socket)),
  setInstancePeer: (peer) => dispatch(setPeer(peer))
}))
export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ready: false
    }
  }

  componentDidMount(){
    const {
      updateConnectionAddress,
      updateSocketTypes,
      updateSocketGlobalEntries,
      updateSocketLocalEntries,
      setInstanceSocket,
      setInstancePeer
    } = this.props

    Promise.all([
      // DEVELOPMENT: 'ws://localhost:8000'
      createSocket('ws://udias.online'),
      createPeer()
    ])
    .then(([ socket, peer ]) => {

      setInstanceSocket(socket)
      setInstancePeer(peer)

      // initial request for remoteAdress
      socket.get('/api/v1/connection/address').then((address) => {
        updateConnectionAddress(address)

        socket.on('/tasks/types', updateSocketTypes)
        socket.on('/tasks/entries', updateSocketGlobalEntries)
        socket.on(`/tasks/entries/${address}`, updateSocketLocalEntries)

        // ensure available data
        Promise.all([
          socket.once('/tasks/types'),
          socket.once('/tasks/entries')
        ]).then((results) => {
          this.setState({ ready: true })
        })

      })
    })
    .catch(::console.error)
  }

  render(){
    const { ready } = this.state
    return (
      <div className={__['App']}>
        <div className={__['Content']}>
          <Header/>
          <Main>
            {ready ? this.props.children : (<Loader/>)}
          </Main>
          <Footer/>
        </div>
        <Modal/>
      </div>
    )
  }
}
