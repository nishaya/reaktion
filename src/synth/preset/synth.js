// @flow

import BasePreset from './base'

export default class SynthPreset extends BasePreset {
  volume: number = 100
  waveform = 'sawtooth'

  export(): Object {
    const {
      volume,
      waveform,
    } = this

    return {
      type: 'synth',
      volume,
      waveform,
    }
  }
}
