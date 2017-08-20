// @flow

import React, { Component } from 'react'
import type { Steps } from 'types/step'
import StepsPreview from './steps_preview'
import Box from './box'

export type BaseFragmentProps = {
  steps: Steps,
  onChange: (steps: Steps) => any,
}

export type BaseFragmentState = {
  steps: Steps,
}

type Props = {
  onChange: (steps: Steps) => void,
  steps: Steps,
}

export default class BaseFragment extends Component<any, Props, BaseFragmentState> {
  static defaultProps: any = {
    onChange: (steps: Steps) => console.log('BaseFragment.onChange', steps),
  }

  state: BaseFragmentState = {
    steps: [],
  }

  componentDidMount() {
    console.log(`${this.constructor.name}.componentDidMount`, this.props.steps)
    this.transform(this.props.steps)
  }

  componentWillReceiveProps(nextProps: BaseFragmentProps) {
    console.log(`${this.constructor.name}.componentWillReceiveProps`, nextProps.steps)
    if (nextProps.steps !== this.props.steps) {
      this.transform(nextProps.steps)
    }
  }

  props: Props

  transform(steps: Steps) {
    console.log('BaseFragment.transform', steps)
    const newSteps = steps.slice(0)
    this.props.onChange(newSteps)
    this.setState({ steps: newSteps })
  }

  renderPreview() {
    const { steps } = this.state
    return <StepsPreview steps={steps} />
  }

  render() {
    return (<Box>
      <h2>base fragment</h2>
      {this.renderPreview()}
    </Box>)
  }
}
