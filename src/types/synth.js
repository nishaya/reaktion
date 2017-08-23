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

export type SynthPresetType = 'osc' | 'sample'
export type OscSynthPreset = {
  type: SynthPresetType,
  waveform: Waveform,
}
export type SynthPreset = OscSynthPreset

export type DrumType = 'kick' | 'snare' | 'ohh' | 'chh' | 'cymbal'
export type DrumPresetType = 'sample' | 'synth'
export type DrumPreset = {
  type: DrumPresetType,
  sample: Sample,
}
export type DrumsMap = { [DrumType]: DrumPreset }
