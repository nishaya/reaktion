import React, { Component } from 'react'
import Rack from 'components/common/rack'
import type { Steps } from 'types/step'
import Synth from 'synth/synth'
import Pattern from './pattern'

type Props = {
  trackId: string,
  onTrackFixed: (steps: Steps, trackId: string) => any,
  onSynthReady: (synth: Synth) => void,
}

export default class Track extends Component<any, any, Props> {
  static defaultProps = {
    trackId: 'not set',
    onTrackFixed: (steps: Steps, trackId: string) => console.log(`track fixed(Track #${trackId})`, steps),
    onSynthReady: (synth: Synth) => console.log('Track.onSynthReady', synth),
  }

  componentWillMount() {
    this.synth = new Synth()
    this.props.onSynthReady(this.synth)
  }

  synth: Synth
  props: Props

  render() {
    const { trackId } = this.props
    return (<Rack theme={{ bgColor: '#FAFAFA' }}>
      <h2>track #{trackId}</h2>
      <Pattern onPatternChanged={(steps: Steps) => this.props.onTrackFixed(steps, trackId)} />
    </Rack>)
  }
}
