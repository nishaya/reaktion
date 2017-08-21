// @flow

import type { PlayOption } from 'types/synth'

const ctx = new window.AudioContext()

const defaultPlayOption: PlayOption = {
  offset: 0,
  duration: 0.2,
  velocity: 100,
}

export default class SimpleSynth {
  waveform: string = 'square'

  play(note: number, playOption: PlayOption = {}) {
    const { offset, duration } = { ...defaultPlayOption, ...playOption }
    const startTime = ctx.currentTime + offset
    const frequency = 440 * (2 ** ((note - 69) / 12))
    console.log(`Synth.scheduled, offset: ${offset}, startTime: ${startTime}, note: ${note}, ${frequency}`)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    gain.gain.setValueAtTime(1, startTime)
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
