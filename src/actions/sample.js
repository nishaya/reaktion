// @flow

import { createAction } from 'redux-actions'
import { STORE_SAMPLE } from 'actions/action_types'

export default {
  storeSample: createAction(
    STORE_SAMPLE,
    key => ({ key }), (key, meta) => ({ ...meta }),
  ),
}
