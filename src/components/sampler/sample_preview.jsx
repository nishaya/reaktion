// @flow

import React, { Component } from 'react'
import Box from 'components/seq/fragments/box'
import type { Sample } from 'types/sampler'

const PreviewBox = Box.extend`
  width: 600px;
  margin: 0px;
`

const WIDTH = 600
const HEIGHT = 64

type Props = {
  sample: ?Sample,
}

export default class SamplePreview extends Component {
  static defaultProps: Props = {
    buffer: null,
  }
  componentDidMount() {
    this.renderPreview(this.props.sample)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.sample !== this.props.sample) {
      this.renderPreview(nextProps.sample)
    }
  }

  canvas: any
  props: Props

  renderPreview(sample: ?Sample) {
    console.log('renderPreview', sample)
    if (!sample) {
      return
    }
    const { buffer } = sample
    const samples = buffer.getChannelData(0)
    console.log('len', samples.length)

    const start = sample.loopStart || 0
    const end = sample.loopEnd || sample.buffer.duration
    const offset = sample.offset || 0
    console.log('start/end', start, end)

    const ctx = this.canvas.getContext('2d')
    const samplesPerPixel = samples.length / WIDTH
    ctx.imageSmoothingEnabled = false
    ctx.fillStyle = 'rgb(203, 213, 198)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    ctx.strokeStyle = 'rgb(98, 104, 95)'
    ctx.lineWidth = 1
    const halfHeight = HEIGHT / 2
    let pt = null
    for (let i = 0; i < WIDTH; i += 1) {
      const s = samples[Math.floor(samplesPerPixel * i)]
      const top = Math.ceil(halfHeight + s * halfHeight)
      ctx.beginPath()
      ctx.moveTo(i, pt || top)
      ctx.lineTo(i + 1, top)
      ctx.stroke()
      pt = top
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'


    if (start !== 0) {
      const w = Math.floor(sample.buffer.sampleRate * start / samplesPerPixel)
      ctx.fillRect(0, 0, w, HEIGHT)
      console.log('w', w)
    }

    // stroke offset
    ctx.strokeStyle = 'rgb(255, 0, 0)'
    ctx.beginPath()
    const x = Math.floor(sample.buffer.sampleRate * offset / samplesPerPixel)
    ctx.moveTo(x, 0)
    ctx.lineTo(x, HEIGHT)
    ctx.stroke()

    if (end !== sample.buffer.duration) {
      const left = Math.ceil(sample.buffer.sampleRate * end / samplesPerPixel)
      const w = Math.ceil(
        sample.buffer.sampleRate * (sample.buffer.duration - end) / samplesPerPixel)
      console.log('left/w', left, w)
      ctx.fillRect(left, 0, w, HEIGHT)
    }
  }

  render() {
    const { sample } = this.props
    return (<PreviewBox theme={{ bgColor: '#fafafa' }}>
      {sample ? (<div>
        length: {sample.buffer.length}, duration: {sample.buffer.duration}<br />
        offset: {sample.offset}, start: {sample.loopStart}, end: {sample.loopEnd}<br />
        <canvas
          ref={(canvas) => { this.canvas = canvas }}
          width={WIDTH}
          height={HEIGHT}
        />
      </div>) : 'no sample'}
    </PreviewBox>)
  }
}
