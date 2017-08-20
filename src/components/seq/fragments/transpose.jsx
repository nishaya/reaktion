// @flow

import React, { Component } from 'react'
import { Slider } from 'material-ui'
import type { Steps } from 'types/step'
import Box from './box'
import StepsPreview from './steps_preview'

type Props = {
  steps: Steps,
  onChange: (steps: Steps) => any,
  transpose: number,
}

type State = {
  transpose: number,
  steps: Steps,
  octave: number,
  notes: number,
}

export default class Transpose extends Component<any, Props, State> {
  static defaultProps = {
    transpose: -31,
    steps: [],
  }

  state: State = {
    transpose: 0,
    octave: 0,
    notes: 12,
    steps: [],
  }

  componentDidMount() {
    const { transpose } = this.props
    const octave = transpose >= 0 ? Math.floor(transpose / 12) : Math.ceil(transpose / 12)
    const notes = transpose % 12
    this.changeTranspose(octave, notes)
  }

  props: Props

  changeTranspose(octave: number, notes: number) {
    console.log('changeTranspose', octave, notes)
    this.setState({ transpose: (octave * 12) + notes, octave, notes }, () => {
      this.transform(this.props.steps)
    })
  }

  transform(steps: Steps) {
    const newSteps = steps.map((step) => {
      if (step === -1) {
        return step
      }
      let note = step + this.state.transpose
      if (note > 127) {
        note = 127
      } else if (note < 0) { note = 0 }
      return note
    })
    this.props.onChange(newSteps)
    this.setState({ steps: newSteps })
  }

  render() {
    const { steps, transpose, octave, notes } = this.state
    return (<Box theme={{ bgColor: '#cdefab' }}>
      <h2>transpose</h2>
      <div>
        octave
        <Slider
          max={4}
          min={-4}
          value={octave}
          step={1.0}
          onChange={(e, v) => this.changeTranspose(v, notes)}
        />
      </div>
      <div>
        notes
        <Slider
          max={12}
          min={-12}
          value={notes}
          step={1.0}
          onChange={(e, v) => this.changeTranspose(octave, v)}
        />
      </div>
      <div>
        {transpose} notes.
      </div>
      <StepsPreview steps={steps} />
    </Box>)
  }
}
