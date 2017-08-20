// @flow

import React, { Component } from 'react'
import { Slider } from 'material-ui'
import type { Steps } from 'types/step'
import Box from './box'
import StepsPreview from './steps_preview'

type Props = {
  steps: Steps,
  onChange: (steps: Steps) => any,
  notes: number,
  perNote: boolean,
}

type State = {
  perNote: boolean,
  notes: number,
  steps: Steps,
}

export default class Stairs extends Component<any, Props, State> {
  static defaultProps = {
    perNote: true,
    notes: 5,
    steps: [],
  }

  state: State = {
    perNote: false,
    notes: 0,
    steps: [],
  }

  componentDidMount() {
    const { notes, perNote } = this.props
    this.setNotes(notes, perNote)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.steps !== this.props.steps) {
      this.transform(nextProps.steps)
    }
  }

  setNotes(notes: number, perNote: boolean) {
    this.setState({ notes, perNote }, () => this.transform(this.props.steps))
  }

  props: Props

  transform(steps: Steps) {
    const { notes, perNote } = this.state
    let currentNotes = 0
    const newSteps = steps.map((step) => {
      const note = step + currentNotes
      if (!perNote || step !== -1) {
        currentNotes += notes
      }
      if (step === -1) {
        return step
      } else if (note > 127) {
        return 127
      } else if (note < 0) {
        return 0
      }
      return note
    })
    this.props.onChange(newSteps)
    this.setState({ steps: newSteps })
  }

  render() {
    const { steps, notes, perNote } = this.state
    return (<Box theme={{ bgColor: '#efabcd' }}>
      <h2>stairs</h2>
      <Slider
        max={12}
        min={-12}
        value={notes}
        step={1.0}
        onChange={(e, v) => this.setNotes(v, perNote)}
      />
      <div>
        by {notes} notes / {perNote ? 'per note' : 'per step'}
      </div>
      <StepsPreview steps={steps} />
    </Box>)
  }
}
