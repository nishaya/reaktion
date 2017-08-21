// @flow

import type { Steps } from 'types/step'
import type { PlayOption } from 'types/synth'

const trace = msg => console.log(msg)
const now = (): number => performance.now()

export default class Scheduler {
  bpm: number = 130
  msPerStep: number

  playing: boolean = false
  started: number = -1
  lastPlayed: number = 0
  step: number = 0

  steps: Steps = { length: 0, list: [] }

  onScheduling = (note: number, option: PlayOption = {}) => trace(`onScheduling ${note}`, option)
  onBeat = (note: number, option: PlayOption = {}) => trace(`onBeat ${note}`, option)

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

      const currentStep = this.step % this.steps.length
      this.steps.list
        .filter(s => s.position >= currentStep && s.position < currentStep + 1)
        .forEach((step) => {
          const { note, velocity } = step
          trace(`scheduleSound step: ${this.step}, offset: ${offset}, note: ${note}`)
          this.onScheduling(note, { offset, velocity })
        })

      if (this.step % 4 === 0) {
        trace(`beat, offset: ${offset}`)
        this.onBeat(0, { offset })
      }

      this.step += 1
    }

    if (this.playing) {
      window.setTimeout(
        () => this.loop(),
        this.getLoopInterval(),
      )
    }
  }
}
