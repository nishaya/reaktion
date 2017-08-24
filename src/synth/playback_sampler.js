// @flow

import type { PlaybackOptions } from 'types/synth'
import type { Sample } from 'types/sampler'

const ctx: AudioContext = new window.AudioContext()

const defaultOptions: PlaybackOptions = {
  when: 0,
  playbackRate: 1.0,
}

export default class PlaybackSampler {
  sample: Sample

  constructor(sample: Sample) {
    this.sample = sample
  }

  play(options: PlaybackOptions = {}) {
    console.log('PlaybackSampler.play', this.sample)
    const { when, duration, playbackRate } = {
      ...defaultOptions,
      ...options,
    }
    const { loopStart, loopEnd, offset, loop, transpose } = this.sample
    const playDuration = duration || this.sample.buffer.duration
    console.log(`start: ${loopStart}, end: ${loopEnd}`, loop, offset, playDuration, playbackRate)
    const source = ctx.createBufferSource()
    const startTime = ctx.currentTime + when
    source.buffer = this.sample.buffer
    source.loop = loop
    const modifiedRate = (2 ** (transpose / 12))
    source.playbackRate.value = playbackRate * modifiedRate
    source.loopStart = loopStart
    source.loopEnd = loopEnd
    source.connect(ctx.destination)
    source.start(startTime, offset, playDuration)
  }
}
