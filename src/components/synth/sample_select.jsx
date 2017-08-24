// @flow

import React, { Component } from 'react'
import { MenuItem, SelectField } from 'material-ui'

type Props = {
  sampleList: { [string]: string },
  onChange: (key: string) => void,
  selected: ?string,
  label: string,
}

export default class SampleSelect extends Component {
  static defaultProps = {
    onChange: (key: string) => console.log('sample selected', key),
    label: 'select sample',
  }
  props: Props

  render() {
    const { sampleList, selected, label } = this.props
    return (<SelectField
      floatingLabelText={label}
      value={selected}
      onChange={(ev, key, value: string) => {
        this.props.onChange(value)
      }}
    >
      {Object.keys(sampleList).map(key => (
        <MenuItem key={`s_${key}`} value={key} primaryText={sampleList[key]} />
      ))}
    </SelectField>)
  }
}
