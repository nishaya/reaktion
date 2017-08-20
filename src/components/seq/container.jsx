// @flow

import React, { Component } from 'react'
import { RaisedButton, FontIcon } from 'material-ui'
import type { Steps, Step } from 'types/step'
import Rack from 'components/common/rack'
import Track from './track'
import { initSteps } from './fragments/steps_generator'
import StepsPreview from './fragments/steps_preview'

const Button = RaisedButton

const MAX_TRACKS = 4

type State = {
  tracks: Array<Track>,
  stepsMap: { [number]: Steps },
  steps: Steps,
}

type Props = {
  defaultTracks: number,
}

export default class SeqContainer extends Component {
  static defaultProps = {
    defaultTracks: 2,
  }

  state: State = {
    tracks: [],
    stepsMap: {},
    steps: initSteps(0),
  }

  componentDidMount() {
    this.addTrack(this.props.defaultTracks)
  }

  props: Props

  addTrack(num: number = 1) {
    const { tracks } = this.state
    if (tracks.length + num <= MAX_TRACKS) {
      for (let i = 0; i < num; i += 1) {
        const trackId = tracks.length
        const props = {
          onTrackFixed: (steps: Steps, id: number) => {
            console.log(`track #${id} fixed(SeqContainer)`, steps)
            const { stepsMap } = this.state
            stepsMap[id] = steps
            console.log('stepsMap', stepsMap)
            const stepsList = Object.values(stepsMap)
            const lengths = stepsList.map(s => s.length)
            console.log(lengths)
            const newSteps = {
              length: Math.max(...lengths),
              list: [].concat(...stepsList.map(s => s.list)),
            }
            console.log(newSteps)
            this.setState({ stepsMap, steps: newSteps })
          },
          trackId,
        }
        tracks.push(<Track key={`track_${trackId}`} {...props} />)
      }
    }
    this.setState({ tracks })
  }

  render() {
    const { tracks, steps } = this.state
    return (<Rack>
      <h2>seq</h2>
      {tracks}
      <div>
        <Button
          icon={<FontIcon className="material-icons">add</FontIcon>}
          disabled={tracks.length >= MAX_TRACKS}
          onClick={() => this.addTrack()}
          label="Add Track"
        />
        <StepsPreview steps={steps} />
      </div>
    </Rack>)
  }
}
