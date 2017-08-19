import React, { Component } from 'react'
import Rack from 'components/common/rack'
import Pattern from './pattern'

export default class Track extends Component {
  render() {
    return (<Rack>
      <h2>track</h2>
      <Pattern />
    </Rack>)
  }
}
