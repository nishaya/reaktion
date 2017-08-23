// @flow

import React, { Component } from 'react'
import { DropDownMenu, MenuItem } from 'material-ui'

type Props = {
  sampleList: { [string]: string },
  onChange: (key: string) => void,
}

export default class SampleSelect extends Component {
  static defaultProps = {
    onChange: (key: string) => console.log('sample selected', key),
  }
  props: Props

  render() {
    const { sampleList } = this.props
    return (<DropDownMenu
      onChange={(ev, key, value) => {
        this.props.onChange(value)
      }}
    >
      {Object.keys(sampleList).map(key => (
        <MenuItem key={`s_${key}`} value={key} primaryText={sampleList[key]} />
      ))}
    </DropDownMenu>)
  }
}
