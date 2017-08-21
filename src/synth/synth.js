// @flow

import type { Tone } from 'types/synth'

const ctx = new window.AudioContext()

const defaultTone: Tone = {
  note: 0,
  offset: 0,
  duration: 0.2,
  velocity: 100,
}

type SynthType = 'synth' | 'drums'

export default class Synth {
  waveform: string = 'square'
  kickWaveform: string = 'sine'
  type: SynthType
  play: (tone: Tone) => void

  constructor(type: SynthType = 'synth') {
    console.log('init Synth', type)
    this.type = type
    if (type === 'synth') {
      this.play = this.playOsc
    } else if (type === 'drums') {
      this.play = this.playDrums
    }
  }

  playDrums(tone: Tone) {
    const { note, offset } = { ...defaultTone, ...tone }
    const startTime = ctx.currentTime + offset
    const frequency = 440 * (2 ** ((note - 69) / 12))
    console.log(`Synth.playDrums, offset: ${offset}, startTime: ${startTime}, note: ${note}, freq: ${frequency}`)
    const osc = ctx.createOscillator()
    const duration = 0.18
    const gain = ctx.createGain()

    gain.gain.setValueAtTime(1, startTime)
    gain.gain.setValueAtTime(1, startTime + (duration * 0.7))
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
    osc.type = this.kickWaveform
    osc.frequency.setValueAtTime(330, startTime)
    osc.frequency.exponentialRampToValueAtTime(55, startTime + (duration * 0.5))
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(startTime)
    osc.stop(startTime + duration)
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
