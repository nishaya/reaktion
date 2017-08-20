// @flow

import React from 'react'
import { FontIcon } from 'material-ui'

// https://material.io/icons/
const iconNames = {
  generator: 'more_horiz',
  transpose: 'swap_vert',
  stairs: 'call_made',
  repeat: 'repeat',
}

export const icon = (name: string) => {
  const iconName = iconNames[name] || name
  return <FontIcon className="material-icons">{iconName}</FontIcon>
}

export default { icon }
