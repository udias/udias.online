/**
 * # Container: Home
 *
 *
 */

import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import __ from './Home.styl'

@connect((state) => ({
  entries: state.socket.entries
}))
export default class Home extends Component {
  render(){
    const { entries, entriesLocal } = this.props
    const hasEntries = Boolean(entries.global.length || entries.local.length)
    return (
      <div className={__['Home']}>
        <Link className={__['Box']} to="/suppliant">
          <h3 className={__['Title']}>Suppliant</h3>
          <p className={__['Text']}>
            Got a problem which can't be solved on your current system ?
            Check if one of the supported tasks can help and specify some settings.
          </p>
        </Link>
        {hasEntries && (
          <Link className={__['Box']} to="/patron">
            <h3 calssName={__['Title']}>Patron</h3>
            <p className={__['Text']}>
              Are you on a powerful system and got some cycles to spare ?
              Select one of the available submissions and help solving the problem.
            </p>
          </Link>
        )}
      </div>
    )
  }
}
