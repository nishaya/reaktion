// @flow

import React, { Component } from 'react'
import { IconMenu, MenuItem, IconButton } from 'material-ui'
import { icon } from './fragments/icon'
import Fragments from './fragments/index'

const { Transpose, Repeat, Stairs, Stretch, Limit, Scale } = Fragments

const fragmentClasses = [Transpose, Repeat, Stairs, Stretch, Limit, Scale]

type Props = {
  onMenuSelected: (klass: Function) => void,
}

export default class AddFragment extends Component {
  props: Props
  render() {
    return (<IconMenu
      iconButtonElement={<IconButton>{icon('add')}</IconButton>}
      label="Add"
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      targetOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      {fragmentClasses.map((klass, i) => {
        const className = klass.name
        const iconName = className.toLowerCase()
        const key = `af_${i}_${className}`
        return (<MenuItem
          key={key}
          leftIcon={icon(iconName)}
          primaryText={className}
          onClick={() => this.props.onMenuSelected(klass)}
        />)
      })}
    </IconMenu>)
  }
}
