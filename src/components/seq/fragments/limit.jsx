// @flow

import React, { Component } from 'react'
import { Slider } from 'material-ui'
import type { Steps } from 'types/step'
import { sliderStyle } from 'components/common/styles'
import Box from './box'
import StepsPreview from './steps_preview'
import { icon } from './icon'
import { initSteps } from './steps_generator'

type Props = {
  steps: Steps,
  onChange: (steps: Steps) => any,
  count: number,
  top: number,
  bottom: number,
}

type State = {
  top: number,
  bottom: number,
  steps: Steps,
}

export default class Limit extends Component<any, Props, State> {
  static defaultProps = {
    top: 127,
    bottom: 0,
    count: 2,
    steps: initSteps(0),
  }

  state: State = {
    top: 127,
    bottom: 0,
    steps: initSteps(0),
  }

  componentDidMount() {
    this.setLimit(this.props.top, this.props.bottom)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.steps !== this.props.steps) {
      this.transform(nextProps.steps)
    }
  }

  setLimit(top: number, bottom: number) {
    this.setState({ top, bottom }, () => {
      this.transform(this.props.steps)
    })
  }

  props: Props

  transform(steps: Steps) {
    console.log('limit.transform', steps)
    const { top, bottom } = this.state
    const newList = steps.list.map((step) => {
      let { note } = step
      if (note > top) {
        note = top
      } else if (note < bottom) {
        note = bottom
      }
      return { ...step, note }
    })
    const newSteps = { ...steps, list: newList }
    this.props.onChange(newSteps)
    this.setState({ steps: newSteps })
  }

  render() {
    const { steps, top, bottom } = this.state
    return (<Box theme={{ bgColor: '#F48FB1' }}>
      <div className="control">
        <h2>{icon('limit')}limit</h2>
        top
        <Slider
          sliderStyle={sliderStyle}
          max={127}
          min={bottom}
          value={top}
          step={1.0}
          onChange={(e, v) => this.setLimit(v, bottom)}
        />
        bottom
        <Slider
          sliderStyle={sliderStyle}
          max={top}
          min={0}
          value={bottom}
          step={1.0}
          onChange={(e, v) => this.setLimit(top, v)}
        />
        <div>
          {bottom} - {top}
        </div>
      </div>
      <StepsPreview steps={steps} />
    </Box>)
  }
}
