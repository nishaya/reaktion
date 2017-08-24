// @flow

import React from 'react'
import { FontIcon } from 'material-ui'

// https://material.io/icons/
const iconNames = {
  generator: 'more_horiz',
  transpose: 'swap_vert',
  stairs: 'call_made',
  repeat: 'repeat',
  limit: 'vertical_align_top',
  finishing: 'done',
}

export const icon = (name: string, size?: number) => {
  const iconName = iconNames[name] || name
  const style = {}
  if (size) {
    style.fontSize = size
  }
  return <FontIcon className="material-icons" style={style}>{iconName}</FontIcon>
}

export default { icon }
