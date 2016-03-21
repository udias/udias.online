/**
 * # Container: Patron
 *
 *
 */

import React, { Component, PropTypes } from 'react'

import __ from './Patron.styl'

export default class Patron extends Component{
  render(){
    return (
      <div className={__['Patron']}>
        <p>
          The current prototype doesn't provide a graphical user interface for solving tasks in the browser.
          Checkout the commandline tool to process tasks for now.
        </p>
      </div>
    )
  }
}
