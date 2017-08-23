// @flow

import type { Sample } from 'types/sampler'

export type Tone = {
  note: number,
  offset?: number,
  duration?: number,
  velocity?: number,
  trackId?: string,
}

export type PlaybackOptions = {
  offset?: number,
  when?: number,
  loop?: boolean,
}

export type SynthType = 'synth' | 'drums'

export type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle'
export type SynthParams = {
  waveform: Waveform,
}

export type SYNTH_PRESET_TYPE_OSC = 'osc'
export type SYNTH_PRESET_TYPE_SAMPLE = 'sample'
export type OscSynthPreset = {
  type: SYNTH_PRESET_TYPE_OSC,
  waveform: Waveform,
}
export type SampleSynthPreset = {
  type: SYNTH_PRESET_TYPE_SAMPLE,
  sample: Sample,
}
export type SynthPreset = OscSynthPreset | SampleSynthPreset

export type DrumType = 'kick' | 'snare' | 'ohh' | 'chh' | 'cymbal'
export type DrumPresetType = 'sample' | 'synth'
export type DrumPreset = {
  type: DrumPresetType,
  sample: Sample,
}
export type DrumsMap = { [DrumType]: DrumPreset }
