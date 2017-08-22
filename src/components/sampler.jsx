// @flow

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SampleActions from 'actions/sample'
import Rack from 'components/common/rack'
import type { Sample } from 'types/sampler'
import { MenuItem, SelectField } from 'material-ui'

type Props = {
  storeSample: (sample: Sample) => any,
  samples: { [string]: Sample },
}

type State = {
  sampleList: Array<MenuItem>,
}

class SamplerComponent extends Component {

  state: State = {
    sampleList: [],
  }

  componentDidMount() {
    for (let i = 0; i < 3; i += 1) {
      this.props.storeSample({
        id: `sample_${i}`,
        name: `noise #${i}`,
        buffer: new ArrayBuffer(),
      })
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.samples !== this.props.samples) {
      const { samples } = nextProps
      const sampleList = Object.keys(samples).map(sampleId => (
        <MenuItem key={sampleId} value={sampleId} primaryText={samples[sampleId].name} />
      ))
      this.setState({ sampleList })
    }
  }

  props: Props

  render() {
    const { sampleList } = this.state
    return (<Rack>
      <h2>sampler</h2>
      <SelectField hintText="please select">
        {sampleList}
      </SelectField>
    </Rack>)
  }
}

const mapStateToProps = store => ({ samples: store.sample.samples })

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...SampleActions },
  dispatch,
)

export default connect(mapStateToProps, mapDispatchToProps)(SamplerComponent)
