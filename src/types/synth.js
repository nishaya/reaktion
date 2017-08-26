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
  when?: number,
  playbackRate?: number,
}

export type SynthType = 'synth' | 'drums'

export type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle'

export type SynthPresetType = 'osc' | 'sample'

export type SynthPreset = {
  type: SynthPresetType,
  waveform: Waveform,
  sample: ?Sample,
}

export type DrumType = 'kick' | 'snare' | 'ohh' | 'chh' | 'cymbal'
export type DrumPresetType = 'sample' | 'synth'
export type DrumPreset = {
  type: DrumPresetType,
  sample: Sample,
}
export type DrumsMap = { [DrumType]: DrumPreset }
