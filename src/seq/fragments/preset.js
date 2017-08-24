// @flow

import { FragmentSetting } from 'types/pattern'
import { Stairs, Transpose, Repeat, Limit } from 'components/seq/fragments/index'

export const defaultFragments: Array<FragmentSetting> = [
  {
    class: Stairs,
    props: { notes: 5 },
  },
  {
    class: Transpose,
    props: { transpose: -31 },
  },
  {
    class: Repeat,
    props: { count: 2 },
  },
  {
    class: Limit,
    props: { top: 100, bottom: 10 },
  },
]

export default {}
