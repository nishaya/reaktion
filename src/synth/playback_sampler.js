// @flow

import type { PlaybackOptions } from 'types/synth'
import type { Sample } from 'types/sampler'

const ctx: AudioContext = new window.AudioContext()

const defaultOptions: PlaybackOptions = {
  when: 0,
  loop: true,
  offset: 0,
  playBackRate: 1.0,
}

export default class PlaybackSampler {
  sample: Sample

  constructor(sample: Sample) {
    this.sample = sample
  }

  play(options: PlaybackOptions = {}) {
    console.log('PlaybackSampler.play', this.sample)
    const { when, duration, loop, offset, playbackRate } = {
      ...defaultOptions,
      ...{ offset: this.sample.start || 0 },
      ...options,
    }
    const { start, end } = this.sample
    const loopStart = start || 0
    const loopEnd = end || this.sample.buffer.duration
    const playDuration = duration || loopEnd - loopStart
    console.log(`start: ${loopStart}, end: ${loopEnd}`, loop, offset, playDuration)
    const source = ctx.createBufferSource()
    const startTime = ctx.currentTime + when
    source.buffer = this.sample.buffer
    source.loop = loop
    source.playbackRate.value = playbackRate
    source.loopStart = loopStart
    source.loopEnd = loopEnd
    source.connect(ctx.destination)
    source.start(startTime, offset, playDuration)
  }
}
