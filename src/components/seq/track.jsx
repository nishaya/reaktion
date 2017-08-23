import React, { Component } from 'react'
import Rack from 'components/common/rack'
import type { Steps } from 'types/step'
import type { SynthPreset, SynthType } from 'types/synth'
import Synth from 'synth/synth'
import SynthControl from 'components/synth/synth_control'
import { basicBeats } from 'seq/steps/drums'
import Pattern from './pattern'
import { initSteps } from './fragments/steps_generator'

type Props = {
  trackId: string,
  onTrackFixed: (steps: Steps, trackId: string) => any,
  onSynthReady: (synth: Synth) => void,
}

type State = {
  synthType: SynthType,
}

const buildPatternProps = (trackId: string) => {
  let patternType = 'synth'
  let steps = initSteps(4)
  if (trackId === '0') {
    patternType = 'drums'
    steps = basicBeats
  }

  return {
    patternType,
    steps,
  }
}

export default class Track extends Component<any, any, Props> {
  static defaultProps = {
    trackId: 'not set',
    onTrackFixed: (steps: Steps, trackId: string) => console.log(`track fixed(Track #${trackId})`, steps),
    onSynthReady: (synth: Synth) => console.log('Track.onSynthReady', synth),
  }

  state: State = {
    synthType: 'synth',
  }

  componentWillMount() {
    const { trackId } = this.props
    const synthType = trackId === '0' ? 'drums' : 'synth'
    this.synth = new Synth(synthType)
    this.props.onSynthReady(this.synth)
    this.setState({ synthType })
  }

  onPresetChanged(synthPreset: SynthPreset) {
    console.log('track.onPresetChanged', synthPreset)
    this.synth.setSynth(synthPreset)
  }

  synth: Synth
  props: Props

  render() {
    const { trackId } = this.props
    const { synthType } = this.state
    const patternProps = buildPatternProps(trackId)
    return (<Rack theme={{ bgColor: '#FAFAFA' }}>
      <h2>track #{trackId}({synthType})</h2>
      <Pattern
        {...patternProps}
        onPatternChanged={(steps: Steps) => this.props.onTrackFixed(steps, trackId)}
      />
      <SynthControl
        synthType={synthType}
        onPresetChanged={(synthPreset: SynthPreset) => this.onPresetChanged(synthPreset)}
        setDrum={(type, preset) => this.synth.setDrum(type, preset)}
      />
    </Rack>)
  }
}
