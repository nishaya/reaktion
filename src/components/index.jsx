// @flow

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SeqContainer from 'components/seq/container'
import SamplerContainer from 'components/sampler'
import type { Sample } from 'types/sampler'

type Props = {
  samples: { [string]: Sample },
}

export class IndexComponent extends Component {
  props: Props

  componentWillReceiveProps(nextProps) {
    if (this.props.samples !== nextProps.samples) {
      console.log('samples updated', nextProps.samples)
    }
  }

  render() {
    return (<div>
      <SamplerContainer />
      <SeqContainer />
    </div>)
  }
}

const mapStateToProps = store => ({ samples: store.sample.samples })

const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch,
)

export default connect(mapStateToProps, mapDispatchToProps)(IndexComponent)
