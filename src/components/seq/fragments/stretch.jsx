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
  count: number,
}

type State = {
  count: number,
  steps: Steps,
}

export default class Stretch extends Component<any, Props, State> {
  static defaultProps = {
    count: 1,
    steps: initSteps(0),
  }

  state: State = {
    count: 1,
    steps: initSteps(0),
  }

  componentDidMount() {
    this.setCount(this.props.count)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.steps !== this.props.steps) {
      this.transform(nextProps.steps)
    }
  }

  setCount(count: number) {
    this.setState({ count }, () => {
      this.transform(this.props.steps)
    })
  }

  props: Props

  transform(steps: Steps) {
    const { count } = this.state
    const list = steps.list.map(s => ({
      ...s,
      position: s.position * count,
      duration: s.duration * count,
    }))
    const newSteps = { length: count * steps.length, list }
    this.props.onChange(newSteps)
    this.setState({ steps: newSteps })
  }

  render() {
    const { steps, count } = this.state
    return (<Box theme={{ bgColor: '#B39DDB' }}>
      <div className="control">
        <h2>{icon('stretch')}stretch</h2>
        <Slider
          max={4}
          min={0.25}
          value={count}
          step={0.25}
          onChange={(e, v) => this.setCount(v)}
        />
        <div>
          x {count}
        </div>
      </div>
      <StepsPreview steps={steps} />
    </Box>)
  }
}
