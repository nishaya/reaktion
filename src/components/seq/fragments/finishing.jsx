// @flow

import React, { Component } from 'react'
import type { Steps } from 'types/step'
import { Toggle } from 'material-ui'
import Box from './box'
import StepsPreview from './steps_preview'
import { icon } from './icon'
import { initSteps } from './steps_generator'
import colors from './colors'

type Props = {
  steps: Steps,
  onChange: (steps: Steps) => any,
  patternLength: number,
  mute: boolean,
  solo: boolean,
  fill: boolean,
}

type State = {
  steps: Steps,
  mute: boolean,
}

export default class Finishing extends Component<any, Props, State> {
  static defaultProps = {
    count: 2,
    steps: initSteps(0),
    patternLength: 16,
    mute: false,
    solo: false,
    fill: true,
  }

  state: State = {
    steps: initSteps(0),
    mute: false,
  }

  componentWillMount() {
    const { mute } = this.props
    this.setState({ mute }, () => this.transform(this.props))
  }

  componentWillReceiveProps(nextProps: Props) {
    this.transform(nextProps)
  }

  props: Props

  transform(props: Props) {
    const { steps, patternLength, fill } = props
    const { mute } = this.state
    if (mute) {
      const newSteps = { ...steps, list: [] }
      this.props.onChange(newSteps)
      this.setState({ steps: newSteps })
      return
    }
    const oldList = steps.list
    const oldLength = steps.length
    const newList = steps.list.slice(0)
    if (fill && oldLength > 0 && patternLength > oldLength) {
      const repeatCount = Math.ceil(patternLength / oldLength)
      for (let i = 1; i < repeatCount; i += 1) {
        newList.push(
          ...oldList.map(s => (
            { ...s, position: s.position + (i * oldLength) }
          )),
        )
      }
    }
    const newSteps = {
      length: patternLength,
      list: newList.filter(s => s.position < patternLength),
    }
    this.props.onChange(newSteps)
    this.setState({ steps: newSteps })
  }

  render() {
    const { steps, mute } = this.state
    return (<Box theme={{ bgColor: colors.finishing }}>
      <div className="control">
        <h2>{icon('finishing')}<span className="text">finishing</span></h2>
        <Toggle
          toggled={mute}
          label="Mute"
          onToggle={(e, checked) => {
            this.setState({ mute: checked }, () => this.transform(this.props))
          }}
          style={{ marginTop: 16 }}
        />
      </div>
      <StepsPreview steps={steps} />
    </Box>)
  }
}
