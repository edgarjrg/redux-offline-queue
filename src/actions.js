const ACTION_PREFIX = 'redux-offline-queue/'

/**
 * External actions.
 * Should be called from the outside to property set the connection state.
 *
 * We're doing it this way to not couple tighly with react-native and make it possible
 * to use the queue in a different environment.
 */
export const ONLINE = `${ACTION_PREFIX}ONLINE`
export const OFFLINE = `${ACTION_PREFIX}OFFLINE`
export const AUTO_ENQUEUE = `${ACTION_PREFIX}AUTO_ENQUEUE`
export const RETRY_ALL = `${ACTION_PREFIX}RETRY_ALL`
export const RETRY = `${ACTION_PREFIX}RETRY`

/**
 * Internal actions.
 * These are fired to manage the internal offline queue state.
 */
export const QUEUE_ACTION = `${ACTION_PREFIX}QUEUE_ACTION`
export const RESET_QUEUE = `${ACTION_PREFIX}RESET_QUEUE`
