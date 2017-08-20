import React, { Component } from 'react'
import type { Steps } from 'types/step'
import { RaisedButton } from 'material-ui'
import StepsGenerator, { initSteps } from './fragments/steps_generator'
import Transpose from './fragments/transpose'
import Repeat from './fragments/repeat'
import Stairs from './fragments/stairs'
import Limit from './fragments/limit'
import StepsPreview from './fragments/steps_preview'
import { icon } from './fragments/icon'

const Button = RaisedButton

type Props = {
  onPatternChanged: (steps: Steps) => void,
}

type State = {
  numFragments: number,
  initialSteps: Steps,
  stepsList: Array<Steps>,
  fragments: Array<Component>,
  playing: boolean,
}

export default class Pattern extends Component<any, State, Props> {
  static defaultProps = {
    onPatternChanged: (steps: Steps) => console.log('PATTERN CHANGED', steps),
  }

  state: State = {
    numFragments: 0,
    initialSteps: [],
    stepsList: [initSteps(0)],
    fragments: [StepsGenerator],
    playing: false,
  }

  componentDidMount() {
    this.addFragment([Transpose, Repeat], this.updateSteps)
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
    console.log('updateSteps')
    this.setState({ initialSteps: initSteps(4) })
  }

  modifySteps(index:number, steps: Steps) {
    console.log('modifySteps', index, steps)
    const list = this.state.stepsList.slice(0)
    list[index] = { ...steps }
    this.setState({ stepsList: list })

    if (index === list.length - 1) {
      this.props.onPatternChanged(steps)
    }
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
      console.log(props)
      return React.createElement(klass, props)
    })
  }

  render() {
    const { stepsList, initialSteps, playing } = this.state
    console.log('stepsList', stepsList)
    const playButton = (<Button
      onClick={() => {
        this.scheduler.start()
        this.setState({ playing: true })
      }}
    >Play</Button>)
    const stopButton = (<Button
      onClick={() => {
        this.scheduler.stop()
        this.setState({ playing: false })
      }}
    >Stop</Button>)
    return (<div>
      <h2>pattern</h2>
      <div>
        {playing ? stopButton : playButton}
      </div>
      <div>
        <div>
          <StepsGenerator
            steps={initialSteps}
            onChange={(steps: Steps) => {
              this.modifySteps(0, steps)
            }}
          />
          {this.renderFragments()}
          <StepsPreview steps={stepsList[stepsList.length - 1]} />
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
