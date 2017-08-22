// @flow

import createReducer from 'utils/create_reducer'
import { STORE_SAMPLE } from 'actions/action_types'

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
