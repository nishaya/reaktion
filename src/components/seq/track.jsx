import React, { Component } from 'react'
import Rack from 'components/common/rack'
import type { Steps } from 'types/step'
import type { SynthPreset, SynthType } from 'types/synth'
import Synth from 'synth/synth'
import SynthControl from 'components/synth/synth_control'
import { basicBeats } from 'seq/steps/drums'
import { basicPad } from 'seq/steps/pad'
import { seqFragments } from 'seq/fragments/preset'
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

// FIXME: preset for demo
const buildPatternProps = (trackId: string) => {
  let patternType = 'synth'
  let steps = initSteps(4)
  let defaultFragments = []
  if (trackId === '0') {
    patternType = 'drums'
    steps = basicBeats
  }

  if (trackId === '1') {
    defaultFragments = seqFragments
  }

  if (trackId === '2') {
    steps = basicPad
  }

  return {
    patternType,
    steps,
    defaultFragments,
  }
}

// FIXME: preset for demo
const buildSynthProps = (trackId: string) => {
  const preloadDrums = trackId === '0' ? ['snare', 'cymbal'] : []
  const preloadSample = trackId === '2' ? 'sample_str' : null

  return {
    preloadDrums,
    preloadSample,
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
    this.synth.setSynth(synthPreset)
  }

  synth: Synth
  props: Props

  render() {
    const { trackId } = this.props
    const { synthType } = this.state
    const patternProps = buildPatternProps(trackId)
    const synthProps = buildSynthProps(trackId)
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
        {...synthProps}
      />
    </Rack>)
  }
}
