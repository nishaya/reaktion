// @flow

import type { Steps } from 'types/step'
import type { Tone } from 'types/synth'

const now = (): number => performance.now()

export default class Scheduler {
  bpm: number = 130
  msPerStep: number

  playing: boolean = false
  started: number = -1
  lastPlayed: number = 0
  step: number = 0

  steps: Steps = { length: 0, list: [] }

  onScheduling = (tone: Tone = { note: 0 }) => console.log('onScheduling', tone)
  onBeat = (tone: Tone = { note: 0 }) => console.log('onBeat', tone)

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
    console.log('Scheduler.start')
    this.playing = true
    this.loop(true)
  }

  stop() {
    console.log('Scheduler.stop')
    this.playing = false
  }

  loop(initialize: boolean = false) {
    const current: number = now()
    if (initialize) {
      this.step = 0
      this.started = current
      this.lastPlayed = current - this.msPerStep
      console.log(`started at ${this.started}`)
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
          console.log(step)
          this.onScheduling({ note, offset, velocity })
        })

      if (this.step % 4 === 0) {
        this.onBeat({ note: 0, offset })
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
