import React, { Component } from 'react'
import Rack from 'components/common/rack'
import type { Steps } from 'types/step'
import Pattern from './pattern'

type Props = {
  trackId: number,
  onTrackFixed: (steps: Steps, trackId: number) => any,
}

export default class Track extends Component<any, any, Props> {
  static defaultProps = {
    trackId: -1,
    onTrackFixed: (steps: Steps, trackId: number) => console.log(`track fixed(Track #${trackId})`, steps),
  }

  props: Props

  render() {
    const { trackId } = this.props
    return (<Rack>
      <h2>track #{trackId}</h2>
      <Pattern onPatternChanged={(steps: Steps) => this.props.onTrackFixed(steps, trackId)} />
    </Rack>)
  }
}
