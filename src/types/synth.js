// @flow

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

export type DrumType = 'kick' | 'snare' | 'ohh' | 'chh' | 'cymbal'
export type DrumPresetType = 'sample' | 'synth'
export type DrumPreset = {
  type: DrumPresetType,
}
export type DrumsMap = { [DrumType]: DrumPreset }
