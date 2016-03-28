/**
 * # Container: Suppliant - SuppliantForm - (FieldTypes) - File
 *
 *
 */

import React, { Component, PropTypes } from 'react'
import Dropzone from 'react-dropzone'
import prettyBytes from 'pretty-bytes'

import __ from './File.styl'

export default class File extends Component{

  static defaultProps = {
    config: {}
  }

  static propTypes = {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  render(){
    const { config, value, onChange } = this.props
    return (
      <div className={__['File']}>
        <Dropzone
          className={__['Dropzone']}
          activeClassName={__['Dropzone--active']}
          onDrop={(files) => onChange(files[0])}
          multiple={false}
          accept={config.accept}
        >
          {!value ? (
            <div>Select a file</div>
          ) : (
            <div className={__['Feedback']}>
              {value.type.indexOf('image') > -1 && (
                <img className={__['Preview']} src={value.preview}/>
              )}
              <div>{value.name}</div>
              <div>({prettyBytes(value.size)})</div>
            </div>
          )}
        </Dropzone>
      </div>
    )
  }
}
