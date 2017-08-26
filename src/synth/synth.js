// @flow

import type {
  Tone,
  Waveform,
  DrumsMap,
  DrumType,
  DrumPreset,
  SynthPreset,
} from 'types/synth'
import PlaybackSampler from './playback_sampler'
import { generateWhiteNoise } from './gen/noise'

const ctx: AudioContext = new window.AudioContext()

const CENTER_C = 60

const defaultTone: Tone = {
  note: 0,
  offset: 0,
  duration: 0.2,
  velocity: 100,
}

type SynthType = 'synth' | 'drums'

export default class Synth {
  waveform: Waveform = 'square'
  kickWaveform: Waveform = 'sine'
  type: SynthType
  noise: AudioBuffer
  play: (tone: Tone) => void
  drumsMap: DrumsMap = {}
  synthPreset: SynthPreset = { type: 'osc', waveform: 'square', sample: null }
  sampler: PlaybackSampler

  constructor(type: SynthType = 'synth') {
    this.type = type
    if (type === 'synth') {
      this.play = this.playSynth
    } else if (type === 'drums') {
      this.noise = generateWhiteNoise(ctx)
      this.play = this.playDrums
    }
  }

  setDrum(type: DrumType, preset: DrumPreset) {
    this.drumsMap[type] = preset
  }

  setSynth(preset: SynthPreset) {
    this.synthPreset = preset
    if (preset.type === 'osc') {
      this.waveform = preset.waveform
      this.play = this.playSynth
    } else if (preset.type === 'sample' && preset.sample) {
      this.play = this.playSample
      this.sampler = new PlaybackSampler(preset.sample)
    }
  }

  playDrums(tone: Tone) {
    const { note, offset, velocity } = { ...defaultTone, ...tone }
    const startTime = ctx.currentTime + offset
    const part = note % 12
    if (part === 0) { // kick
      const osc = ctx.createOscillator()
      const duration = 0.18
      const gain = ctx.createGain()
      const volume = velocity / 127 * 0.8

      gain.gain.setValueAtTime(volume, startTime)
      gain.gain.setValueAtTime(volume, startTime + (duration * 0.7))
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
      osc.type = this.kickWaveform
      osc.frequency.setValueAtTime(330, startTime)
      osc.frequency.exponentialRampToValueAtTime(55, startTime + (duration * 0.5))
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + duration)
    } else if (part === 6 || part === 10) { // chh & ohh
      const source = ctx.createBufferSource()
      let duration = 0.01
      let release = 0.05
      const gain = ctx.createGain()

      if (part === 10) {
        duration = 0.01
        release = 0.4
      }

      source.buffer = this.noise
      source.loop = true
      const volume = velocity / 127 * 0.7
      gain.gain.setValueAtTime(volume, startTime)
      gain.gain.setValueAtTime(volume, startTime + duration)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration + release)
      source.connect(gain)
      gain.connect(ctx.destination)
      source.start(startTime)
      source.stop(startTime + duration + release)
    } else if (part === 1) { // cymbal
      const preset = this.drumsMap.cymbal
      if (preset && preset.type === 'sample') {
        const sampler = new PlaybackSampler(preset.sample)
        sampler.play({ when: offset })
      }
    } else if (part === 2) { // snare
      const preset = this.drumsMap.snare
      if (preset && preset.type === 'sample') {
        const sampler = new PlaybackSampler(preset.sample)
        sampler.play({ when: offset })
      }
    }
  }

  playSynth(tone: Tone) {
    const { note, offset, duration, velocity } = { ...defaultTone, ...tone }
    const startTime = ctx.currentTime + offset
    const frequency = 440 * (2 ** ((note - 69) / 12))
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    const volume = velocity / 127 * 0.7

    gain.gain.setValueAtTime(0.01, startTime)
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.01)
    gain.gain.setValueAtTime(volume, startTime + (duration * 0.7))
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
    osc.type = this.waveform
    osc.frequency.value = frequency
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(startTime)
    osc.stop(startTime + duration)
  }

  playSample(tone: Tone) {
    const { note, offset, duration } = { ...defaultTone, ...tone }
    const playbackRate = (2 ** ((note - CENTER_C) / 12))
    this.sampler.play({ when: offset, playbackRate, duration, loop: true })
  }
}
