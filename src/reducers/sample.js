// @flow

import { STORE_SAMPLE } from 'actions/action_types'
import { createReducer } from './index'

const initialState = {
  pressedKeys: {},
}
export default createReducer(initialState, {
  [STORE_SAMPLE]: (state, action) => (
    {
      ...state,
      pressedKeys: { ...state.pressedKeys, [action.payload.key]: true },
    }
  ),
})
