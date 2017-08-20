// @flow

import React, { Component } from 'react'
import { FontIcon } from 'material-ui'

// https://material.io/icons/
const iconNames = {
  generator: 'mode_horiz',
  transpose: 'swap_vert',
  stairs: 'call_made',
  repeat: 'repeat',
}

type Props = {
  name: string,
}

export default class Icon extends Component {
  static defaultProps = {
    name: 'generator',
  }

  props: Props

  render() {
    const icon = iconNames[this.props.name] || this.props.name
    return <FontIcon className="material-icons">{icon}</FontIcon>
  }
}
