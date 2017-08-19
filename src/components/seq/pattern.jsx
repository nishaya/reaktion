import React, { Component } from 'react'
import type { Steps } from 'types/step'
import { RaisedButton } from 'material-ui'
import StepsGenerator from './fragments/steps_generator'
// import Transpose from './transpose'
// import Repeat from './repeat'
// import Stairs from './stairs'
import StepsPreview from './fragments/steps_preview'

const Button = RaisedButton

export default class Pattern extends Component {
  state: {
    numFragments: number,
    initialSteps: Steps,
    stepsList: Array<Steps>,
    fragments: Array<Component>,
    playing: boolean,
  } = {
    numFragments: 0,
    initialSteps: [],
    stepsList: [[]],
    fragments: [StepsGenerator],
    playing: false,
  }

  componentDidMount() {
    this.addFragment([], this.updateSteps)
  }

  addFragment(klass, callback = () => {}) {
    const klasses = Array.isArray(klass) ? klass : [klass]
    const stepsList = this.state.stepsList.slice(0)
    const fragments = this.state.fragments.slice(0)
    klasses.forEach((k) => {
      stepsList.push([])
      fragments.push(k)
    })
    this.setState({ stepsList, fragments }, callback)
  }

  updateSteps() {
    console.log('updateSteps')
    this.setState({ initialSteps: [64, 64, -1] })
  }

  modifySteps(index:number, steps: Steps) {
    console.log('modifySteps', index, steps)
    const list = this.state.stepsList.slice(0)
    list[index] = steps.slice(0)
    this.setState({ stepsList: list })

    if (index === list.length - 1) {
      // this.scheduler.setSteps(steps)
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
      <h2>track</h2>
      <div>
        {playing ? stopButton : playButton}
      </div>
      <div>
        <StepsGenerator
          steps={initialSteps}
          onChange={(steps: Steps) => {
            this.modifySteps(0, steps)
          }}
        />
        {this.renderFragments()}
        <StepsPreview steps={stepsList[stepsList.length - 1]} />
        <Button onClick={() => this.addFragment(Transpose)}>add Transpose</Button>
        <Button onClick={() => this.addFragment(Repeat)}>add Repeat</Button>
        <Button onClick={() => this.addFragment(Stairs)}>add Stairs</Button>
      </div>
    </div>)
  }
}
