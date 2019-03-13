import { REHYDRATE } from 'redux-persist'
import { get, filter } from "lodash";

import INITIAL_STATE from './initialState'
import { QUEUE_ACTION, ONLINE, OFFLINE, RESET_QUEUE, AUTO_ENQUEUE, REMOVE } from './actions'

/**
 * Reducer for the offline queue.
 *
 * @param {Object} state Offline queue Redux store state.
 * @param {Object} action Action that was dispatched to the store.
 */
export default function reducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case AUTO_ENQUEUE: {
      return { ...state, autoEnqueue: action.payload.value }
    }
    case REHYDRATE: { // Handle rehydrating with custom shallow merge.

      if (action.payload && action.payload.offline) {
        return { ...state, ...action.payload.offline };
      }

      return state
    }
    case QUEUE_ACTION:
      return { ...state, queue: state.queue.concat(action.payload) }
    case ONLINE:
      return { ...state, autoEnqueue: false }
    case OFFLINE:
      return { ...state, autoEnqueue: true }
    case RESET_QUEUE:
      return { ...state, queue: [] }
    case REMOVE:
      const removeId = get(action, 'payload.meta.queue.id')

      return {
        ...state,
        queue: filter(state.queue, action => {
          const actionId = get(action, 'meta.queue.id')
          return removeId !== actionId
        })
      }
    default:
      return state
  }
}
