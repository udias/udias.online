/**
 * # Container: Suppliant - SuppliantPending
 *
 *
 */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import __ from './SuppliantPending.styl'

@connect((state) => ({
  request: state.request
}))
export default class SuppliantPending extends Component {
  render(){
    const { request } = this.props
    console.log('SuppliantPending', request);
    return (
      <div className={__['SuppliantPending']}>
        Waiting for another system to help with the task...
      </div>
    )
  }
}
