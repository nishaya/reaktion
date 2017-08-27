import React, { Component } from 'react'
import type { Steps } from 'types/step'
import { PatternType, FragmentSetting } from 'types/pattern'
import AddFragment from './add_fragment'
import StepsGenerator, { initSteps } from './fragments/steps_generator'
import Finishing from './fragments/finishing'

type Props = {
  onPatternChanged: (steps: Steps) => void,
  patternType: PatternType,
  steps: Steps,
  defaultFragments: Array<FragmentSetting>,
  length: number,
}

type State = {
  numFragments: number,
  initialSteps: Steps,
  stepsList: Array<Steps>,
  fragments: Array<FragmentSetting>,
  finishedSteps: Steps,
}

export default class Pattern extends Component<any, State, Props> {
  static defaultProps = {
    steps: initSteps(4),
    patternType: 'synth',
    defaultFragments: [],
    onPatternChanged: (steps: Steps) => console.log('PATTERN CHANGED', steps),
    length: 32,
  }

  state: State = {
    numFragments: 0,
    initialSteps: initSteps(0),
    stepsList: [initSteps(0)],
    fragments: [{ class: StepsGenerator, props: {} }],
    finishedSteps: initSteps(0),
  }

  componentDidMount() {
    const { defaultFragments } = this.props
    this.addFragment(defaultFragments, this.updateSteps)
  }

  props: Props

  addFragment(fragmentSettings: Array<FragmentSetting>, callback = () => {}) {
    const stepsList = this.state.stepsList.slice(0)
    const fragments = this.state.fragments.slice(0)
    fragmentSettings.forEach((fs) => {
      stepsList.push(initSteps(0))
      fragments.push(fs)
    })
    this.setState({ stepsList, fragments }, callback)
  }

  updateSteps() {
    const { steps } = this.props
    this.setState({ initialSteps: steps })
  }

  modifySteps(index:number, steps: Steps) {
    const list = this.state.stepsList.slice(0)
    list[index] = { ...steps }
    this.setState({ stepsList: list })
  }

  renderFragments() {
    const { stepsList, fragments } = this.state
    return fragments.map((fragment, index) => {
      const props = {
        key: `f_${index}`,
        onChange: (steps: Steps) => {
          this.modifySteps(index, steps)
        },
        ...fragment.props,
      }
      if (index === 0) {
        return null
      }
      props.steps = stepsList[index - 1]
      return React.createElement(fragment.class, props)
    })
  }

  render() {
    const { patternType } = this.props
    const { stepsList, initialSteps } = this.state
    const { length } = this.props
    return (<div>
      <div>
        <div>
          <StepsGenerator
            drums={patternType === 'drums'}
            steps={initialSteps}
            onChange={(steps: Steps) => {
              this.modifySteps(0, steps)
            }}
          />
          {this.renderFragments()}
          <AddFragment onMenuSelected={klass => this.addFragment([{ class: klass }])} />
          <Finishing
            patternLength={length}
            steps={stepsList[stepsList.length - 1]}
            onChange={(steps: Steps) => {
              this.props.onPatternChanged(steps)
            }}
          />
        </div>
      </div>
    </div>)
  }
}
