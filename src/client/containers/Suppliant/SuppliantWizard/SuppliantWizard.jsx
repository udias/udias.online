/**
 * # Container: Suppliant - SuppliantWizard
 *
 * Multi-Step Form to create a request
 */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import Dropdown from 'react-dropdown'
import { createManifest } from '../../../utilities/specific'
import { getLocalAdress } from '../../../utilities/network'

import {
  updateValue,
  updateScope,
  toggleDetails,
  updateManifest,
  toggleConfirmed
} from '../../../redux/modules/request'

import { updateDetails } from '../../../redux/modules/connection'

import Progress from './Progress/Progress'
import FileField from './FieldTypes/File/File'
import RadioField from './FieldTypes/Radio/Radio'
import SliderField from './FieldTypes/Slider/Slider'

const TYPES = {
  file: FileField,
  radio: RadioField,
  slider: SliderField
}

import __ from './SuppliantWizard.styl'

@connect((state) => ({
  request: state.request,
  address: state.connection.address,
  socket: state.instances.socket,
  peer: state.instances.peer
}), (dispatch) => ({
  updateRequestValue: (name, value) => dispatch(updateValue(name, value)),
  updateRequestScope: (scope) => dispatch(updateScope(scope)),
  toggleRequestDetails: () => dispatch(toggleDetails()),
  updateConnectionDetails: (details) => dispatch(updateDetails(details)),
  updateRequestManifest: (manifest) => dispatch(updateManifest(manifest)),
  toggleRequestConfirmed: () => dispatch(toggleConfirmed())
}))
export default class SuppliantWizard extends Component {

  static propTypes = {
    setup: PropTypes.array.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      page: 0
    }
  }

  render(){
    const { updateRequestValue, updateRequestScope, toggleRequestDetails } = this.props
    const { setup, request } = this.props
    const { values, scope, details } = request
    const { page } = this.state

    // description
    const { name, role, text, type, config } = setup[page] || {}

    const FieldType = TYPES[type]
    const updateValue = (value) => updateRequestValue(name, value)

    return (
      <div className={__['SuppliantWizard']}>
        <Progress setup={setup} values={values} page={page} name={name} onClick={::this.changePage}/>
        <div className={__['Content']}>
          <div className={__['Navigation']}>
            <button
              className={__['Buttons']}
              disabled={page === 0}
              onClick={() => this.changePage(page - 1)}
            >
              Previous
            </button>
          </div>
          <div className={__['Steps']}>
            <form onSubmit={::this.onSubmit}>
              {FieldType ? (
                <div>
                  <div className={__['Text']}>{text}</div>
                  <div className={__['Input']}>
                    <FieldType
                      name={name}
                      value={values[name]}
                      config={config}
                      onChange={(value) => updateRequestValue(name, value)}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <table className={__['Matches']}>
                    <tbody>
                    {Object.keys(values).map((key, i) => {
                      const value = values[key].name || values[key]
                      return (
                        <tr className={__['Match']} key={i}>
                          <td className={__['Key']}>{key}:</td>
                          <td className={__['Value']}>{value}</td>
                        </tr>
                      )
                    })}
                    </tbody>
                  </table>
                  <div>
                    <label>Scope:</label>
                    <Dropdown
                      className={'Scope'}
                      options={['global', 'local', 'private']}
                      value={scope}
                      onChange={(select) => updateRequestScope(select.value)}
                    />
                  </div>
                  <div>
                    <label>Details:</label>
                    <input className={__['Details']} type="checkbox" value={details} onChange={toggleRequestDetails}/>
                  </div>
                  <button className={__['Confirm']} type="submit">Confirm</button>
                </div>
              )}
            </form>
          </div>
          <div className={__['Navigation']}>
            <button
              className={__['Buttons']}
              disabled={page === setup.length || !values[name]}
              onClick={() => this.changePage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )
  }

  changePage (page) {
    this.setState({ page })
  }

  onSubmit (e) {
    e.preventDefault()
    e.stopPropagation()

    const { socket, peer } = this.props
    const { updateConnectionDetails, updateRequestManifest, toggleRequestConfirmed } = this.props
    const { address, setup, request } = this.props

    const { type, values, scope, details } = request

    const prepare = [
      createManifest({ type, setup, values, peer }).then((manifest) => {
        updateRequestManifest(manifest)
        const virtualManifest = new Buffer(JSON.stringify(manifest))
        virtualManifest.name = 'manifest'
        return peer.seed(virtualManifest)
      })
    ]

    if (details) {
      prepare.push(getLocalAdress())
      prepare.push(socket.get('/api/v1/connection/details'))
    }

    Promise.all(prepare).then(([ torrent, localAddress, details ]) => {

      const connection = {}
      if (scope === 'local') {
        Object.assign(connection, {
          remoteAddress: address
        })
      }
      if (details) {
        Object.assign(connection, {
          localAddress,
          details
        })
        updateConnectionDetails(connection)
      }

      const { infoHash } = torrent

      const message = {
        type: 'create',
        scope: scope,
        manifest: infoHash,
        connection
      }
      console.log(message)

      socket.once(`/tasks/results/${infoHash}`).then((data) => {
        // data
        console.log('resultHash', data)
        peer.read(data).then((result) => {
          console.log('peer', result)
        })
      })

      socket.send('/tasks/entries', message).then(() => {
        console.log('=>', torrent.infoHash, torrent.magnetURI)
        toggleRequestConfirmed()
      })
    })
  }
}
