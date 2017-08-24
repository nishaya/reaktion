// @flow

import React, { Component } from 'react'
import { Slider } from 'material-ui'
import type { Steps } from 'types/step'
import { sliderStyle } from 'components/common/styles'
import Box from './box'
import StepsPreview from './steps_preview'
import { initSteps } from './steps_generator'
import { icon } from './icon'

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
    transpose: 0,
    steps: initSteps(0),
  }

  state: State = {
    transpose: 0,
    octave: 0,
    notes: 12,
    steps: initSteps(0),
  }

  componentDidMount() {
    const { transpose, steps } = this.props
    console.log('transpose did mount', transpose, steps)
    const octave = transpose >= 0 ? Math.floor(transpose / 12) : Math.ceil(transpose / 12)
    const notes = transpose % 12
    this.changeTranspose(steps, octave, notes)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.steps !== this.props.steps) {
      this.transform(nextProps.steps)
    }
  }

  props: Props

  changeTranspose(steps: Steps, octave: number, notes: number) {
    console.log('changeTranspose', steps, octave, notes)
    this.setState({ transpose: (octave * 12) + notes, octave, notes }, () => {
      this.transform(steps)
    })
  }

  transform(steps: Steps) {
    console.log('transpose.transform', steps)
    const newList = steps.list.map((step) => {
      let note = step.note + this.state.transpose
      if (note > 127) {
        note = 127
      } else if (note < 0) { note = 0 }
      return { ...step, note }
    })
    const newSteps = { ...steps, list: newList }
    this.props.onChange(newSteps)
    this.setState({ steps: newSteps })
  }

  render() {
    const { steps, transpose, octave, notes } = this.state
    return (<Box theme={{ bgColor: '#FFCC80' }}>
      <div className="control">
        <h2>{icon('transpose')}transpose</h2>
        <div>
          octave
          <Slider
            sliderStyle={sliderStyle}
            max={4}
            min={-4}
            value={octave}
            step={1.0}
            onChange={(e, v) => this.changeTranspose(this.props.steps, v, notes)}
          />
        </div>
        <div>
          notes
          <Slider
            sliderStyle={sliderStyle}
            max={12}
            min={-12}
            value={notes}
            step={1.0}
            onChange={(e, v) => this.changeTranspose(this.props.steps, octave, v)}
          />
        </div>
        <div>
          {transpose} notes.
        </div>
      </div>
      <StepsPreview steps={steps} />
    </Box>)
  }
}
