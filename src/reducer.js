import { REHYDRATE } from 'redux-persist'
import uuid from 'uuid/v1'
import { get, filter } from "lodash";

import INITIAL_STATE from './initialState'
import {
  QUEUE_ACTION,
  AUTO_ENQUEUE,
  REMOVE,
  RETRY
} from './actions'
import { over } from 'ramda';
import { metaPath } from '../tests/utils/utils';
import moment from 'moment'

/**
 * Reducer for the offline queue.
 *
 * @param {Object} state Offline queue Redux store state.
 * @param {Object} action Action that was dispatched to the store.
 */
export default function reducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case AUTO_ENQUEUE: {
      return { ...state, suspendSaga: action.payload.value }
    }
    case REHYDRATE: { // Handle rehydrating with custom shallow merge.

      if (action.payload && action.payload.offline) {
        return { ...state, ...action.payload.offline };
      }

      return state
    }
    case QUEUE_ACTION:
      return { ...state, queue: state.queue.concat(enhace(action.payload)) }
    case REMOVE:
      return removeFromQueue(state, action)
    case RETRY:
      return state
    default:
      return state
  }
}

function removeFromQueue(state, action) {
  const removeId = get(action, 'payload.meta.queue.id')
  return {
    ...state,
    queue: filter(state.queue, action => {
      const actionId = get(action, 'meta.queue.id')
      return removeId !== actionId
    })
  }
}

function enhace(action) {

  return over(
    metaPath,
    meta => ({
      ...meta,
      times: (meta.times || 0) + 1,
      id: meta.id || uuid(),
      ttl: meta.ttl || moment().toISOString(),
      throttle: moment().add(1, 'minute').toISOString(),
    }),
    action
  )

}