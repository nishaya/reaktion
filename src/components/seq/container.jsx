// @flow

import React, { Component } from 'react'
import { RaisedButton, FontIcon } from 'material-ui'
import type { Steps } from 'types/step'
import Rack from 'components/common/rack'
import Scheduler from 'seq/scheduler'
import type { Tone } from 'types/synth'
import Synth from 'synth/synth'
import Track from './track'
import { initSteps } from './fragments/steps_generator'
import StepsPreview from './fragments/steps_preview'

const Button = RaisedButton

const MAX_TRACKS = 4

const map2Array = (map: {[string]: Steps}): Array<Steps> => Object.keys(map).map(k => map[k])

type State = {
  tracks: Array<Track>,
  stepsMap: { [string]: Steps },
  synthsMap: { [string]: Synth },
  steps: Steps,
  playing: boolean,
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
    synthsMap: {},
    steps: initSteps(0),
    playing: false,
  }

  componentWillMount() {
    this.scheduler = new Scheduler()
    this.scheduler.onScheduling = (tone: Tone) => {
      const { synthsMap } = this.state
      const { trackId } = tone
      if (trackId && synthsMap[trackId]) {
        synthsMap[trackId].play(tone)
      }
    }
  }

  componentDidMount() {
    this.addTrack(this.props.defaultTracks)
  }

  scheduler: Scheduler
  props: Props

  addTrack(num: number = 1) {
    const { tracks } = this.state
    if (tracks.length + num <= MAX_TRACKS) {
      for (let i = 0; i < num; i += 1) {
        const trackId = `${tracks.length}`
        const props = {
          onTrackFixed: (steps: Steps, id: string) => {
            const { stepsMap } = this.state
            stepsMap[id] = steps
            const stepsList = map2Array(stepsMap)
            const lengths = stepsList.map(s => s.length)
            const trackIds = Object.keys(stepsMap)
            const newSteps = {
              length: Math.max(...lengths),
              list: [].concat(...trackIds.map(tid => (
                stepsMap[tid].list.map(st => ({ ...st, trackId: tid }))
              ))),
            }
            this.scheduler.setSteps(newSteps)
            this.setState({ stepsMap, steps: newSteps })
          },
          onSynthReady: (synth: Synth) => {
            const { synthsMap } = this.state
            synthsMap[trackId] = synth
            this.setState({ synthsMap })
          },
          trackId,
        }
        console.log(props)
        tracks.push(<Track key={`track_${trackId}`} {...props} />)
      }
    }
    this.setState({ tracks })
  }

  render() {
    const { tracks, steps, playing } = this.state
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
    return (<Rack>
      <h2>seq</h2>
      <div>
        {playing ? stopButton : playButton}
      </div>
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
