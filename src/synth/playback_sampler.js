// @flow

import type { PlaybackOptions } from 'types/synth'
import type { Sample } from 'types/sampler'

const ctx: AudioContext = new window.AudioContext()

const defaultOptions: PlaybackOptions = {
  offset: 0,
  loop: false,
}

export default class PlaybackSampler {
  sample: Sample

  constructor(sample: Sample) {
    this.sample = sample
  }

  play(options: PlaybackOptions = {}) {
    console.log('PlaybackSampler.play', this.sample)
    const { offset, loop, duration } = {
      ...{ duration: this.sample.buffer.duration },
      ...defaultOptions,
      ...options,
    }
    const { start, end } = this.sample
    const loopStart = start || 0
    const loopEnd = end || this.sample.buffer.duration
    console.log(`start: ${loopStart}, end: ${loopEnd}`)
    const source = ctx.createBufferSource()
    const startTime = ctx.currentTime + offset
    source.buffer = this.sample.buffer
    source.loop = loop
    source.loopStart = loopStart
    source.loopEnd = loopEnd
    source.connect(ctx.destination)
    source.start(startTime)
    source.stop(startTime + duration)
  }
}
