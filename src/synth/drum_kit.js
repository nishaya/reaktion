// @flow

const ctx = new window.AudioContext()

type PlayOption = {
  offset?: number,
  duration?: number,
  velocity?: number,
}

const defaultPlayOption: PlayOption = {
  offset: 0,
  duration: 0.2,
  velocity: 100,
}

export default class DrumKit {
  waveform: string = 'sine'

  play(note: number, playOption: PlayOption = {}) {
    if (note % 12 === 0) {
      const { offset, duration } = { ...defaultPlayOption, ...playOption }
      const startTime = ctx.currentTime + offset
      console.log(`Kick.scheduled, offset: ${offset}, startTime: ${startTime}, note: ${note}`)
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      gain.gain.setValueAtTime(1, startTime)
      gain.gain.setValueAtTime(1, startTime + (duration * 0.7))
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
      osc.type = this.waveform
      osc.frequency.setValueAtTime(330, startTime)
      osc.frequency.exponentialRampToValueAtTime(55, startTime + (duration * 0.5))
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + duration)
    }
  }
}
