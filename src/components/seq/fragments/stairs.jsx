// @flow

import React, { Component } from 'react'
import { Slider } from 'material-ui'
import type { Steps } from 'types/step'
import Box from './box'
import StepsPreview from './steps_preview'
import { icon } from './icon'
import { initSteps } from './steps_generator'

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
    notes: 0,
    steps: initSteps(0),
  }

  state: State = {
    perNote: false,
    notes: 0,
    steps: initSteps(0),
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
    const newList = []
    new Array(steps.length).fill(null).forEach((x, index) => {
      const list = steps.list.filter(s => s.position === index).map((step) => {
        let note = step.note + currentNotes
        if (note > 127) {
          note = 127
        } else if (note < 0) {
          note = 0
        }
        return { ...step, note }
      })
      if (!perNote || list.length > 0) {
        currentNotes += notes
      }
      newList.push(...list)
    })
    const newSteps = { ...steps, list: newList }
    this.props.onChange(newSteps)
    this.setState({ steps: newSteps })
  }

  render() {
    const { steps, notes, perNote } = this.state
    return (<Box theme={{ bgColor: '#E6EE9C' }}>
      <div className="control">
        <h2>{icon('stairs')}stairs</h2>
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
      </div>
      <StepsPreview steps={steps} />
    </Box>)
  }
}
