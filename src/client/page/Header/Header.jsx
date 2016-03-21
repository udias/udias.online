/**
 * # Component: Header
 *
 *
 */

import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import __ from './Header.styl'

/**
 *
 */
export default class Header extends Component {
  render(){
    return (
      <header className={__['Header']}>
        <Link to="/">
          <h2 className={__['Title']}>udias</h2>
          <span className={__['Subtitle']}>Universal Distributed Assistance</span>
        </Link>
        <span className={__['Spacer']}/>
        <Link className={__['About']} to="https://github.com/udias/udias.online">
          | Source
        </Link>
      </header>
    )
  }
}
