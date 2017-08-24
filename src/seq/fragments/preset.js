// @flow

import { FragmentSetting } from 'types/pattern'
import Fragments from 'components/seq/fragments/index'

const { Stairs, Transpose, Repeat, Limit } = Fragments

export const seqFragments: Array<FragmentSetting> = [
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

export const padFragments: Array<FragmentSetting> = [
  {
    class: Repeat,
    props: { count: 4 },
  },
  {
    class: Stairs,
    props: { notes: 5 },
  },
]


export default {}
