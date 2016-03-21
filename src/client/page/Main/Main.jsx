/**
 * # Component: Main
 *
 *
 */

import React, { Component, PropTypes } from 'react'

import __ from './Main.styl'

/**
 *
 */
export default class Main extends Component {
  render(){
    return (
      <div className={__['Main']}>
        <aside className={__['Small']}>
          <div className={__['Info']}>
            <h3 className={__['Header']}>About</h3>
            <p>
              This services allows you to create
              It uses <a href="https://webtorrent.io/">WebTorrent</a>
              to create a peer driven network for exchanging these task and their data.
            </p>
            <p>
              Install the node client to use the platform from the commandline:
            </p>
            <a className={__['Link']} href="http://github.com/uidas/udias-cli" target="_blank">
              npm install -g udias-cli
            </a>
          </div>
        </aside>
        <main className={__['Large']}>
          {this.props.children}
        </main>
      </div>
    )
  }
}
