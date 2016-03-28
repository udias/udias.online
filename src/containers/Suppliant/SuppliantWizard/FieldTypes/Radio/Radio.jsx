/**
 * # Container: Suppliant - SuppliantForm - (FieldTypes) - RadioGroup
 *
 *
 */

import React, { Component, PropTypes } from 'react'
import RadioGroup from 'react-radio-group'

import __ from './Radio.styl'

export default class Radio extends Component{

  static propTypes = {
    // onChange: PropTypes.func.isRequired
  }

  render(){
    const { name, value, config, onChange } = this.props
    console.log(name, value, config.options);
    return (
      <div className={__['Radio']}>
        <RadioGroup name={name} selectedValue={value} onChange={(v) => {
            console.log('v', v);
            onChange(v)
          }}>
          {(Radio) => (
            <div className={__['Options']}>
              {config.options.map((option, i) => {
                return (
                  <div className={__['Option']} key={i}>
                    <Radio
                      className={__['Input']}
                      value={option}
                      id={`${name}__${option}`}
                      />
                    <label className={__['Label']} htmlFor={`${name}__${option}`}>
                      {option}
                    </label>
                  </div>
                )
              })}
            </div>
          )}
        </RadioGroup>
      </div>
    )
  }
}
