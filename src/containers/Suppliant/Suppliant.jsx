/**
 * # Container: Suppliant
 *
 *
 */

import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import { createRequest } from '../../redux/modules/request'
import SuppliantWizard from './SuppliantWizard/SuppliantWizard'

import __ from './Suppliant.styl'

@connect((state, ownProps) => ({
  types: state.socket.types,
  selected: ownProps.params.name
}), (dispatch) => ({
  initializeRequest: (name) => dispatch(createRequest(name))
}))
export default class Suppliant extends Component{

  componentWillMount(){
    this.checkRequestCreation(this.props)
  }

  componentWillUpdate (nextProps) {
    this.checkRequestCreation(nextProps)
  }

  render(){
    const { types, selected } = this.props
    return (
      <div className={__['Suppliant']}>
        <p className={__['Text']}>
          What kind of task you like to get solved ?
        </p>
        {types.map((type, i) => {
          return (
            <div className={__['Task']} key={i}>
              <Link className={__['Link']} to={`/suppliant/${type.type}`}>
                <h3>{type.title}</h3>
              </Link>
              <p className={__['Description']}>{type.text}</p>
              {selected && selected === type.type && (
                <SuppliantWizard setup={type.setup}/>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  checkRequestCreation (props) {
    const { selected, initializeRequest } = props
    if (selected) {
      initializeRequest(selected)
    }
  }
}
