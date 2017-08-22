// @flow

import { STORE_SAMPLE } from 'actions/action_types'
import type { Sample } from 'types/sampler'
import { createReducer } from './index'

export type SampleState = {
  samples: { [string]: Sample },
}

const initialState: SampleState = {
  samples: {},
}
export default createReducer(initialState, {
  [STORE_SAMPLE]: (state: SampleState, action: { payload: Sample }) => {
    const { samples } = state
    samples[action.payload.id] = { ...action.payload }
    return {
      ...state,
      samples,
    }
  },
})
