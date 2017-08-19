// @flow

type Steps = Array<number>

const trace = msg => console.log(msg)
const now = (): number => performance.now()

export default class Scheduler {
  bpm: number = 130
  msPerStep: number

  playing: boolean = false
  started: number = -1
  lastPlayed: number = 0
  step: number = 0

  steps: Steps = [64, -1, -1, -1]

  onScheduling = (offset: number, note: number) => trace(`onScheduling ${offset} ${note}`)
  onBeat = (offset: number, note: number) => trace(`onBeat ${offset} ${note}`)

  constructor() {
    this.setBpm(130)
  }

  setSteps(steps: Steps) {
    this.steps = steps
  }

  setBpm(bpm: number) {
    this.bpm = bpm
    this.msPerStep = 60000 / bpm / 4
  }

  getLoopInterval() {
    return this.msPerStep / 3
  }

  start() {
    trace('Scheduler.start')
    this.playing = true
    this.loop(true)
  }

  stop() {
    trace('Scheduler.stop')
    this.playing = false
  }

  loop(initialize: boolean = false) {
    const current: number = now()
    if (initialize) {
      this.step = 0
      this.started = current
      this.lastPlayed = current - this.msPerStep
      trace(`started at ${this.started}`)
    }

    if (this.lastPlayed < current) {
      this.lastPlayed += this.msPerStep
      // ms to sec
      const offset = (this.lastPlayed - current) / 1000

      const note = this.steps[this.step % this.steps.length]
      if (this.step % 4 === 0) {
        trace(`beat, offset: ${offset}`)
        this.onBeat(offset, 0)
      }

      this.step += 1

      if (note > 0) {
        trace(`scheduleSound step: ${this.step}, offset: ${offset}, note: ${note}`)
        this.onScheduling(offset, note)
      }
    }

    if (this.playing) {
      window.setTimeout(
        () => this.loop(),
        this.getLoopInterval(),
      )
    }
  }
}
