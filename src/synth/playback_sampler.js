// @flow

import type { PlaybackOptions } from 'types/synth'
import type { Sample } from 'types/sampler'

const ctx: AudioContext = new window.AudioContext()

const defaultOptions: PlaybackOptions = {
  when: 0,
  loop: true,
  playbackRate: 1.0,
}

export default class PlaybackSampler {
  sample: Sample

  constructor(sample: Sample) {
    this.sample = sample
  }

  play(options: PlaybackOptions = {}) {
    console.log('PlaybackSampler.play', this.sample)
    const { when, duration, loop, playbackRate } = {
      ...defaultOptions,
      ...options,
    }
    const { loopStart, loopEnd, offset } = this.sample
    const playDuration = duration || loopEnd - offset
    console.log(`start: ${loopStart}, end: ${loopEnd}`, loop, offset, playDuration, playbackRate)
    const source = ctx.createBufferSource()
    const startTime = ctx.currentTime + when
    source.buffer = this.sample.buffer
    source.loop = loop
    source.playbackRate.value = playbackRate
    source.loopStart = loopStart || 0
    source.loopEnd = loopEnd || this.sample.buffer.duration
    source.connect(ctx.destination)
    source.start(startTime, offset, playDuration)
  }
}
