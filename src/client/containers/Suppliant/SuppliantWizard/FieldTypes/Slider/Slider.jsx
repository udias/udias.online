/**
 * # Container: Suppliant - SuppliantForm - (FieldTypes) - Slider
 *
 *
 */

import React, { Component, PropTypes } from 'react'
import ReactSlider from 'react-slider'

import __ from './Slider.styl'

export default class Slider extends Component{

  static defaultProps = {
    config: {}
  }

  static propTypes = {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
    // value: PropTypes.number
  }

  render(){
    const { config, value, onChange } = this.props
    const current = value || config.min
    return (
      <div>
        <ReactSlider
          className={__['Slider']}
          handleClassName={__['Handle']}
          handleActiveClassName={__['Handle--active']}
          barClassName={__['Bar']}
          min={config.min}
          max={config.max}
          step={config.step||1}
          value={current}
          onChange={onChange}
        >
          <label className={__['Label']}>
            {current}
          </label>
        </ReactSlider>
      </div>
    )
  }
}
