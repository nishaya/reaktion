import React from 'react'
import { FlatButton, Slider } from 'material-ui'
import type { Steps } from 'types/step'
import StepsEditor from './steps_editor'
import BaseFragment from './base'
import Box from './box'

type Props = {
  steps: Steps,
  onChange: (steps: Steps) => any,
}

export default class StepsGenerator extends BaseFragment {
  props: Props

  static defaultProps = {
    steps: [],
    onChange: (steps: Steps) => console.log('Step.onChange', steps),
  }

  state: { showEdit: bool, steps: Steps } = {
    length: 4,
    showEdit: false,
    steps: [
      64, 64, 64, 64,
    ],
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

  render() {
    const { showEdit, steps } = this.state
    const length = steps.length
    if (length <= 0) {
      return null
    }

    return (<Box theme={{ bgColor: '#abcdef' }}>
      <h2>step</h2>
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
      {this.renderPreview()}
    </Box>)
  }
}
