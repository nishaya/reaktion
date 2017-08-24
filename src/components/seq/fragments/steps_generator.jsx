import React, { Component } from 'react'
import { RaisedButton, Slider } from 'material-ui'
import type { Steps } from 'types/step'
import { sliderStyle } from 'components/common/styles'
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
      note: 60,
      velocity: 100,
      duration: 0.8,
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
    const { steps } = this.state
    const newList = steps.list.filter(s => s.position < newLength)
    const newSteps = { length: newLength, list: newList }
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

    return (<Box theme={{ bgColor: '#80DEEA' }}>
      <div className="control">
        <h2>{icon('generator')}step gen</h2>
        length: {length}
        <Slider
          sliderStyle={sliderStyle}
          max={16}
          min={1}
          value={length}
          step={1.0}
          onChange={(e, v) => this.setLength(v)}
        />
        <RaisedButton onClick={() => this.setState({ showEdit: !showEdit })}>Edit</RaisedButton>
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
      </div>
      <StepsPreview steps={steps} />
    </Box>)
  }
}
