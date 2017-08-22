// @flow

import { createAction } from 'redux-actions'
import { STORE_SAMPLE } from 'actions/action_types'
import type { Sample } from 'types/sampler'

export default {
  storeSample: createAction(
    STORE_SAMPLE,
    (sample: Sample) => (sample),
    (key: any, meta: any) => ({ ...meta }),
  ),
}
