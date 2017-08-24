import React, { Component } from 'react'
import type { Steps } from 'types/step'
import { RaisedButton } from 'material-ui'
import StepsGenerator, { initSteps } from './fragments/steps_generator'
import Transpose from './fragments/transpose'
import Repeat from './fragments/repeat'
import Stairs from './fragments/stairs'
import Limit from './fragments/limit'
import Finishing from './fragments/finishing'
import { icon } from './fragments/icon'

const Button = RaisedButton

type PatternType = 'synth' | 'drums'

type Props = {
  onPatternChanged: (steps: Steps) => void,
  patternType: PatternType,
  steps: Steps,
}

type State = {
  numFragments: number,
  initialSteps: Steps,
  stepsList: Array<Steps>,
  fragments: Array<Component>,
  finishedSteps: Steps,
}

export default class Pattern extends Component<any, State, Props> {
  static defaultProps = {
    steps: initSteps(4),
    patternType: 'synth',
    onPatternChanged: (steps: Steps) => console.log('PATTERN CHANGED', steps),
  }

  state: State = {
    numFragments: 0,
    initialSteps: initSteps(0),
    stepsList: [initSteps(0)],
    fragments: [StepsGenerator],
    finishedSteps: initSteps(0),
  }

  componentDidMount() {
    const { patternType } = this.props
    if (patternType === 'synth') {
      this.addFragment([Stairs, Transpose, Repeat, Limit], this.updateSteps)
    } else {
      this.updateSteps()
    }
  }

  props: Props

  addFragment(klass, callback = () => {}) {
    const klasses = Array.isArray(klass) ? klass : [klass]
    const stepsList = this.state.stepsList.slice(0)
    const fragments = this.state.fragments.slice(0)
    klasses.forEach((k) => {
      stepsList.push(initSteps(0))
      fragments.push(k)
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
    return fragments.map((klass, index) => {
      const props = {
        key: `f_${index}`,
        onChange: (steps: Steps) => {
          this.modifySteps(index, steps)
        },
      }
      if (index === 0) {
        return null
      }
      props.steps = stepsList[index - 1]
      return React.createElement(klass, props)
    })
  }

  render() {
    const { stepsList, initialSteps } = this.state
    const { patternType } = this.props
    return (<div>
      <h2>pattern({patternType})</h2>
      <div>
        <div>
          <StepsGenerator
            steps={initialSteps}
            onChange={(steps: Steps) => {
              this.modifySteps(0, steps)
            }}
          />
          {this.renderFragments()}
          <Finishing
            steps={stepsList[stepsList.length - 1]}
            onChange={(steps: Steps) => {
              this.props.onPatternChanged(steps)
            }}
          />
        </div>
        <div>
          <Button
            onClick={() => this.addFragment(Transpose)}
            label="Add Transpose"
            icon={icon('transpose')}
          />
          <Button
            onClick={() => this.addFragment(Repeat)}
            label="Add Repeat"
            icon={icon('repeat')}
          />
          <Button
            onClick={() => this.addFragment(Stairs)}
            label="Add Stairs"
            icon={icon('stairs')}
          />
          <Button
            onClick={() => this.addFragment(Limit)}
            label="Add Limit"
            icon={icon('limit')}
          />
        </div>
      </div>
    </div>)
  }
}
