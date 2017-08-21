// @flow

import React, { Component } from 'react'
import type { Steps } from 'types/step'
import Box from './box'
import StepsPreview from './steps_preview'
import { icon } from './icon'
import { initSteps } from './steps_generator'

type Props = {
  steps: Steps,
  onChange: (steps: Steps) => any,
  patternLength: number,
  mute: boolean,
  solo: boolean,
}

type State = {
  steps: Steps,
}

export default class Finishing extends Component<any, Props, State> {
  static defaultProps = {
    count: 2,
    steps: initSteps(0),
    patternLength: 16,
    mute: false,
    solo: false,
  }

  state: State = {
    steps: initSteps(0),
  }

  componentDidMount() {
    this.transform(this.props)
  }

  componentWillReceiveProps(nextProps: Props) {
    this.transform(nextProps)
  }

  props: Props

  transform(props: Props) {
    const { steps, patternLength } = props
    const newList = steps.list.slice(0)
    const newSteps = { length: patternLength, list: newList }
    this.props.onChange(newSteps)
    this.setState({ steps: newSteps })
  }

  render() {
    const { steps } = this.state
    return (<Box theme={{ bgColor: '#90CAF9' }}>
      <div className="control">
        <h2>{icon('repeat')}finishing</h2>
      </div>
      <StepsPreview steps={steps} />
    </Box>)
  }
}
