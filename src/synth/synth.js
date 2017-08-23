// @flow

import type {
  Tone,
  SynthParams,
  Waveform,
  DrumsMap,
  DrumType,
  DrumPreset,
} from 'types/synth'
import PlaybackSampler from './playback_sampler'
import { generateWhiteNoise } from './gen/noise'

const ctx: AudioContext = new window.AudioContext()

const defaultTone: Tone = {
  note: 0,
  offset: 0,
  duration: 0.2,
  velocity: 100,
}

type SynthType = 'synth' | 'drums'

export default class Synth {
  waveform: Waveform = 'square'
  kickWaveform: string = 'sine'
  type: SynthType
  noise: AudioBuffer
  play: (tone: Tone) => void
  drumsMap: DrumsMap = {}

  constructor(type: SynthType = 'synth') {
    console.log('init Synth', type)
    this.type = type
    if (type === 'synth') {
      this.play = this.playOsc
    } else if (type === 'drums') {
      this.noise = generateWhiteNoise(ctx)
      this.play = this.playDrums
    }
  }

  setParams(params: SynthParams) {
    console.log('synth.setParams', params)
    const { waveform } = params
    this.waveform = waveform
  }

  setDrum(type: DrumType, preset: DrumPreset) {
    console.log('Synth.setDrum', type, preset)
    this.drumsMap[type] = preset
  }

  playDrums(tone: Tone) {
    const { note, offset, velocity } = { ...defaultTone, ...tone }
    const startTime = ctx.currentTime + offset
    const part = note % 12
    if (part === 0) { // kick
      const frequency = 440 * (2 ** ((note - 69) / 12))
      console.log(`Synth.playDrums, offset: ${offset}, startTime: ${startTime}, note: ${note}, freq: ${frequency}`)
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
    } else if (part === 6) { // chh
      const frequency = 900
      console.log(`Synth.playDrums, offset: ${offset}, startTime: ${startTime}, note: ${note}, freq: ${frequency}`)
      const source = ctx.createBufferSource()
      const duration = 0.02
      const release = 0.1
      const gain = ctx.createGain()

      source.buffer = this.noise
      source.loop = true
      const volume = velocity / 127 * 0.8
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

  playOsc(tone: Tone) {
    const { note, offset, duration } = { ...defaultTone, ...tone }
    const startTime = ctx.currentTime + offset
    const frequency = 440 * (2 ** ((note - 69) / 12))
    console.log(`Synth.scheduled, offset: ${offset}, startTime: ${startTime}, note: ${note}, freq: ${frequency}`)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    gain.gain.setValueAtTime(0.01, startTime)
    gain.gain.exponentialRampToValueAtTime(1, startTime + 0.01)
    gain.gain.setValueAtTime(1, startTime + (duration * 0.7))
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
    osc.type = this.waveform
    osc.frequency.value = frequency
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(startTime)
    osc.stop(startTime + duration)
  }
}
