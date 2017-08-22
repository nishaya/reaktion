// @flow

import type { PlaybackOptions } from 'types/synth'

const ctx: AudioContext = new window.AudioContext()

const defaultOptions: PlaybackOptions = {
  offset: 0,
  loop: false,
}

export default class PlaybackSampler {
  buffer: AudioBuffer

  constructor(buffer: AudioBuffer) {
    this.buffer = buffer
  }

  play(options: PlaybackOptions) {
    const { offset, loop, duration } = {
      ...{ duration: this.buffer.duration },
      ...defaultOptions,
      ...options,
    }
    console.log('PlaybackSampler.play', duration, offset, this.buffer)
    const source = ctx.createBufferSource()
    const startTime = ctx.currentTime + offset
    source.buffer = this.buffer
    source.loop = loop
    source.connect(ctx.destination)
    source.start(startTime)
    source.stop(startTime + duration)
  }
}