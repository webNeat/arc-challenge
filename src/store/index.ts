import { create } from 'redux-neat'
import * as handlers from './actions'
import * as getters from './selectors'
import { initialState } from './state'

export type * from '../operations'
export const { store, actions, selectors } = create(initialState, { handlers, getters })
