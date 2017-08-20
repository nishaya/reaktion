import React, { Component } from 'react'
import Rack from 'components/common/rack'
import type { Steps } from 'types/step'
import Pattern from './pattern'

type Props = {
  onPatternChanged: (steps: Steps) => any,
}

export default class Track extends Component<any, any, Props> {
  static defaultProps = {
    onPatternChanged: (steps: Steps) => console.log('pattern changed(Track)', steps),
  }

  props: Props

  render() {
    return (<Rack>
      <h2>track</h2>
      <Pattern onPatternChanged={this.props.onPatternChanged} />
    </Rack>)
  }
}
