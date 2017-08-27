// @flow

import type { FragmentSetting } from 'types/pattern'
import Fragments from 'components/seq/fragments/index'

const { Stairs, Transpose, Repeat, Stretch, Scale } = Fragments

export const seqFragments: Array<FragmentSetting> = [
  {
    class: Repeat,
    props: { count: 1 },
  },
  {
    class: Stairs,
    props: { notes: 2 },
  },
  {
    class: Transpose,
    props: { transpose: -20 },
  },
  {
    class: Scale,
    props: { root: 2 },
  },
]

export const drumsFragments: Array<FragmentSetting> = [
  {
    class: Stretch,
    props: { count: 1.0 },
  },
]

export const padFragments: Array<FragmentSetting> = [
  {
    class: Repeat,
    props: { count: 4 },
  },
  {
    class: Transpose,
    props: { transpose: -6 },
  },
  {
    class: Scale,
    props: { root: 2 },
  },
]


export default {}
