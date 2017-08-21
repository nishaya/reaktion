import React, { Component } from 'react'
import Rack from 'components/common/rack'
import type { Steps } from 'types/step'
import SimpleSynth from 'synth/simple_synth'
import Pattern from './pattern'

type Props = {
  trackId: string,
  onTrackFixed: (steps: Steps, trackId: string) => any,
  onSynthReady: (synth: SimpleSynth) => void,
}

export default class Track extends Component<any, any, Props> {
  static defaultProps = {
    trackId: 'not set',
    onTrackFixed: (steps: Steps, trackId: string) => console.log(`track fixed(Track #${trackId})`, steps),
    onSynthReady: (synth: SimpleSynth) => console.log('Track.onSynthReady', synth),
  }

  componentWillMount() {
    this.synth = new SimpleSynth()
    this.props.onSynthReady(this.synth)
  }

  synth: SimpleSynth
  props: Props

  render() {
    const { trackId } = this.props
    return (<Rack>
      <h2>track #{trackId}</h2>
      <Pattern onPatternChanged={(steps: Steps) => this.props.onTrackFixed(steps, trackId)} />
    </Rack>)
  }
}
