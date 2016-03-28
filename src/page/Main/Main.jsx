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
              This website provides a service to handle computation tasks,
              solved by other user. It uses <a href="https://webtorrent.io/">WebTorrent</a> to create a peer driven network for exchanging meta information
              about these task and their data.
            </p>
            <p>
              Install the node client to use it from the command line:
            </p>
            <a className={__['Link']} href="http://github.com/udias/udias-cli" target="_blank">
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
