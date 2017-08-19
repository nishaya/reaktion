// @flow

import React, { Component } from 'react'
import styled from 'styled-components'
import type { Steps } from 'types/step'

const Box = styled.div`
`

const WIDTH = 128
const HEIGHT = 128

type Props = { steps: Steps }

export default class StepsPreview extends Component {
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.steps !== this.props.steps) {
      const { steps } = nextProps
      if (steps.length === 0) {
        return
      }
      const ctx = this.canvas.getContext('2d')
      const pixelsPerStep = WIDTH / steps.length
      const activeNotes = steps.filter(step => step >= 0)
      const min = Math.floor(Math.min(...activeNotes) / (12 - 1)) * 12
      const max = Math.ceil(Math.max(...activeNotes) / (12 + 1)) * 12
      const pixelsPerNote = HEIGHT / (max - min)
      console.log('min/max', min, max, steps)
      ctx.imageSmoothingEnabled = false
      ctx.fillStyle = 'rgb(203, 213, 198)'
      ctx.fillRect(0, 0, WIDTH, HEIGHT)
      ctx.strokeStyle = 'rgb(98, 104, 95)'
      steps.forEach((step, index) => {
        if (step === -1) {
          return
        }
        const top = (pixelsPerNote * (max - step))
        const strokeWidth = Math.floor(top - (pixelsPerNote * (max - step - 1)))
        ctx.lineWidth = strokeWidth
        console.log(strokeWidth)
        ctx.beginPath()
        ctx.moveTo(Math.ceil(index * pixelsPerStep), top)
        ctx.lineTo(Math.ceil((index + 1) * pixelsPerStep), top)
        ctx.stroke()
      })
    }
  }

  canvas: any
  props: Props

  render() {
    const { steps } = this.props
    return (<Box>
      length: {steps.length}<br />
      {steps.join(',')}
      <canvas
        ref={(canvas) => { this.canvas = canvas }}
        width={WIDTH}
        height={HEIGHT}
      />
    </Box>)
  }
}