import React, { Component } from 'react'
import { FlatButton, Slider } from 'material-ui'
import type { Steps } from 'types/step'
import StepsEditor from './steps_editor'
import StepsPreview from './steps_preview'
import Box from './box'
import { icon } from './icon'

type Props = {
  steps: Steps,
  onChange: (steps: Steps) => any,
}

type State = {
  steps: Steps,
}

export const initSteps = (length: number = 4): Steps => {
  const list = []
  for (let i = 0; i < length; i += 1) {
    list.push({
      position: i,
      note: 64,
      velocity: 100,
      duration: 1.0,
    })
  }
  return {
    length,
    list,
  }
}

export default class StepsGenerator extends Component<any, Props, State> {
  static defaultProps = {
    steps: initSteps(0),
    onChange: (steps: Steps) => console.log('Step.onChange', steps),
  }

  state: { showEdit: bool, steps: Steps } = {
    length: 4,
    showEdit: false,
    steps: initSteps(0),
  }

  componentWillReceiveProps(nextProps: Props) {
    const { steps } = nextProps
    if (steps !== this.props.steps) {
      this.props.onChange(steps)
      this.setState({ steps })
    }
  }

  setLength(newLength) {
    console.log('setLength', newLength)
    const newSteps = this.state.steps.slice(0)
    if (newSteps.length > newLength) {
      newSteps.splice(newLength - newSteps.length)
    } else if (newSteps.length < newLength) {
      const num = newLength - newSteps.length
      for (let i = 0; i < num; i += 1) {
        newSteps.push(-1)
      }
    }
    console.log(newSteps)

    this.setState({ length: newLength, steps: newSteps })
    this.props.onChange(newSteps)
  }

  props: Props

  render() {
    const { showEdit, steps } = this.state
    const length = steps.length
    if (length <= 0) {
      return null
    }

    return (<Box theme={{ bgColor: '#abcdef' }}>
      <h2>{icon('generator')}step gen</h2>
      length: {length}
      <Slider
        max={16}
        min={1}
        value={length}
        step={1.0}
        onChange={(e, v) => this.setLength(v)}
      />
      <FlatButton onClick={() => this.setState({ showEdit: !showEdit })}>Edit</FlatButton>
      <StepsEditor
        show={showEdit}
        steps={steps}
        onEdit={(newSteps: Steps) => {
          this.setState({ steps: newSteps })
          this.props.onChange(newSteps)
        }}
        onRequestClose={() => {
          this.setState({ showEdit: false })
        }}
      />
      <StepsPreview steps={steps} />
    </Box>)
  }
}
