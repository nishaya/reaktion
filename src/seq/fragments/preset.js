// @flow

import type { FragmentSetting } from 'types/pattern'
import Fragments from 'components/seq/fragments/index'

const { Stairs, Transpose, Repeat, Limit, Stretch } = Fragments

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
  /*
  {
    class: Scale,
    props: { root: 2 },
  },
  */
  {
    class: Limit,
    props: { top: 100, bottom: 10 },
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
/*
  {
    class: Stairs,
    props: { notes: 5 },
  },
*/
]


export default {}
