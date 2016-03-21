/**
 * # Component: Modal
 *
 * Layer which covers the screens.
 */

import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'
import ReactModal from 'react-modal2'

import SuppliantPending from '../../containers/Suppliant/SuppliantPending/SuppliantPending'

import __ from './Modal.styl'

@connect((state) => ({
  requestConfirmed: state.request.confirmed
}))
export default class Modal extends Component {
  render(){
    const { requestConfirmed } = this.props
    ReactModal.getApplicationElement = () => findDOMNode(this).previousElementSibling
    const ModalContent = requestConfirmed && SuppliantPending
    return (
      <ReactCSSTransitionGroup
        component="div"
        transitionName={'modal-change'}
        transitionAppear={false}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {ModalContent && (
          <ReactModal
            backdropClassName={__['Overlay']}
            modalClassName={__['Content']}
            onClose={()=> {}}
            >
            <ModalContent/>
          </ReactModal>
        )}
      </ReactCSSTransitionGroup>
    )
  }
}
