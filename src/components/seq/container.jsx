// @flow

import React, { Component } from 'react'
import { RaisedButton, FontIcon, Slider } from 'material-ui'
import { sliderStyle } from 'components/common/styles'
import type { Steps } from 'types/step'
import Rack from 'components/common/rack'
import Scheduler from 'seq/scheduler'
import type { Tone } from 'types/synth'
import Synth from 'synth/synth'
import Track from './track'
import { initSteps } from './fragments/steps_generator'


const Button = RaisedButton
const buttonStyle = { margin: 8, width: 200 }

const MAX_TRACKS = 4

const map2Array = (map: {[string]: Steps}): Array<Steps> => Object.keys(map).map(k => map[k])

type State = {
  tracks: Array<Track>,
  stepsMap: { [string]: Steps },
  synthsMap: { [string]: Synth },
  steps: Steps,
  playing: boolean,
  bpm: number,
}

type Props = {
  defaultTracks: number,
}

const defaultBpm = 133

export default class SeqContainer extends Component {
  static defaultProps = {
    defaultTracks: 3,
  }

  state: State = {
    tracks: [],
    stepsMap: {},
    synthsMap: {},
    steps: initSteps(0),
    playing: false,
    bpm: defaultBpm,
  }

  componentWillMount() {
    this.scheduler = new Scheduler(defaultBpm)
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
        tracks.push(<Track key={`track_${trackId}`} {...props} />)
      }
    }
    this.setState({ tracks })
  }

  render() {
    const { tracks, playing, bpm } = this.state
    const playButton = (<Button
      primary
      style={buttonStyle}
      icon={<FontIcon className="material-icons">play_arrow</FontIcon>}
      onClick={() => {
        this.scheduler.start()
        this.setState({ playing: true })
      }}
      label="Play"
    />)
    const stopButton = (<Button
      style={buttonStyle}
      icon={<FontIcon className="material-icons">pause</FontIcon>}
      onClick={() => {
        this.scheduler.stop()
        this.setState({ playing: false })
      }}
      label="Stop"
    />)
    return (<Rack>
      <div>
        {playing ? stopButton : playButton}
        <Button
          style={buttonStyle}
          icon={<FontIcon className="material-icons">add</FontIcon>}
          disabled={tracks.length >= MAX_TRACKS}
          onClick={() => this.addTrack()}
          label="Add Track"
        />
        <div style={{ width: 400, padding: 20 }}>
          BPM: {bpm}
          <Slider
            sliderStyle={sliderStyle}
            value={bpm}
            min={60}
            max={240}
            step={1}
            onChange={(ev, v) => {
              this.scheduler.setBpm(v)
              this.setState({ bpm: v })
            }}
          />
        </div>
      </div>
      {tracks}
    </Rack>)
  }
}
