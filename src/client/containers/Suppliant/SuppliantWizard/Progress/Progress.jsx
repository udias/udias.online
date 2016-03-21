/**
 * # Container: Suppliant - SuppliantWizard - Progress
 *
 */

import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

import __ from './Progress.styl'

export default class Progress extends Component {

  static propTypes = {
    setup: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired
  }

  render(){
    const { setup, values, page, name, onClick } = this.props
    // TODO:
    // - improve progress navigation (as navigate for/back on last step)
    const progress = [...setup.map((field) => field.name), 'confirm'].map((name, i, arr) => {
      return {
        label: name.charAt(0).toUpperCase() + name.substr(1),
        done: Boolean(values[name]),
        next: Boolean(values[arr[i-1]])
      }
    })
    return (
      <ol className={__['Progress']}>
        {progress.map((step, index) => {
          const navigateable = step.done || step.next
          return (
            <li
              className={classnames({
                [__['Step']]: true,
                [__['Step--navigateable']]: navigateable,
                [__['Step--done']]: step.done,
                [__['Step--active']]: index === page
              })}
              key={index}
              >
              <i className={__['Index']} onClick={() => navigateable && onClick(index)}>
                {index+1}
              </i>
              <label className={__['Label']} onClick={() => navigateable && onClick(index)}>
                {step.label}
              </label>
            </li>
          )
        })}
      </ol>
    )
  }
}
