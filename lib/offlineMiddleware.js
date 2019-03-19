'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = offlineMiddleware;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _initialState = require('./initialState');

var _initialState2 = _interopRequireDefault(_initialState);

var _actions = require('./actions');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _ramda = require('ramda');

var _utils = require('../tests/utils/utils');

var _v = require('uuid/v1');

var _v2 = _interopRequireDefault(_v);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _enhanceAction = require('./sharedAlgorithms/enhanceAction');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper method to dispatch the queued action again when the connection is available.
 *
 * It will modify the original action by adding:
 * ```
 * consume: true
 * ```
 * to skip firing the reducer
 * and:
 * ```
 * meta: {
 *   queueIfOffline: false
 * }
 * ```
 * to avoid putting it back to the queue.
 *
 * @param {Array} queue An array of queued Redux actions.
 * @param {Function} dispatch Redux's dispatch function.
 */
function fireQueuedActions(queue, dispatch) {

  function shouldRetryQueuedAction(action) {
    var time = (0, _moment2.default)(action.meta.queue.throttle);
    return time.isBefore((0, _moment2.default)());
  }

  queue.forEach(function (actionInQueue) {

    if (shouldRetryQueuedAction(actionInQueue)) {

      var actionToRemove = {
        type: _actions.RETRY,
        payload: _extends({}, actionInQueue)
      };

      dispatch(actionToRemove);
    }
  });
}

/**
 * Custom Redux middleware for providing an offline queue functionality.
 *
 * Every action that should be queued if the device is offline should have:
 * ```
 * meta: {
 *   queueIfOffline: true
 * }
 * ```
 * property set.
 *
 * When the device is online this just passes the action to the next middleware as is.
 *
 * When the device is offline this action will be placed in an offline queue.
 * Those actions are later dispatched again when the device comes online.
 * Note that this action is still dispatched to make the optimistic updates possible.
 * However it wil have `suspendSaga: true` property set
 * for the `suspendSaga` wrapper to skip the corresponding saga.
 *
 * Note that this queue is not persisted by itself.
 * One should provide a persistence config by using e.g.
 * `redux-persist` to keep the offline queue persisted.
 *
 * @param {Object} userConfig See: config.js for the configuration options.
 */
function offlineMiddleware() {
  var userConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (_ref) {
    var getState = _ref.getState,
        dispatch = _ref.dispatch;
    return function (next) {
      return function (action) {

        var config = (0, _config2.default)(userConfig);

        var context = {
          getState: getState,
          dispatch: dispatch,
          next: next,
          action: action,
          config: config
        };

        if (isRetry(context)) {
          return retry(context);
        } else if (isQueueable(context)) {
          return queue(context);
        } else if (isRetryAll(context)) {
          return retryAll(context);
        } else {
          return next(action);
        }
      };
    };
  };
}

function isRetryAll(_ref2) {
  var getState = _ref2.getState,
      dispatch = _ref2.dispatch,
      next = _ref2.next,
      action = _ref2.action,
      config = _ref2.config;
  var stateName = config.stateName,
      additionalTriggers = config.additionalTriggers;


  var state = _lodash2.default.get(getState(), stateName, _initialState2.default);

  var suspendSaga = state.suspendSaga;


  return !suspendSaga && action.type === _actions.RETRY_ALL || _lodash2.default.includes(additionalTriggers, action.type);
}

function retryAll(_ref3) {
  var getState = _ref3.getState,
      dispatch = _ref3.dispatch,
      next = _ref3.next,
      action = _ref3.action,
      config = _ref3.config;
  var stateName = config.stateName;


  var result = next(action);

  var _$get = _lodash2.default.get(getState(), stateName),
      queue = _$get.queue;

  fireQueuedActions(queue, dispatch);

  return result;
}

function isRetry(_ref4) {
  var getState = _ref4.getState,
      dispatch = _ref4.dispatch,
      next = _ref4.next,
      action = _ref4.action;

  return action.type === _actions.RETRY;
}

function retry(_ref5) {
  var getState = _ref5.getState,
      dispatch = _ref5.dispatch,
      next = _ref5.next,
      action = _ref5.action,
      config = _ref5.config;
  var stateName = config.stateName;


  var state = _lodash2.default.get(getState(), stateName, _initialState2.default);

  var queue = state.queue,
      suspendSaga = state.suspendSaga;

  var nextResult = next(action);

  if (!suspendSaga) {

    var actionToRetry = _lodash2.default.find(queue, function (actionInQueue) {
      var idOfActionInQueue = _lodash2.default.get(actionInQueue, 'meta.queue.id');
      var idOfActionToRetry = _lodash2.default.get(action, 'payload.meta.queue.id');

      return idOfActionInQueue && idOfActionToRetry && idOfActionInQueue === idOfActionToRetry;
    });

    if (actionToRetry) {

      var actionToRemove = {
        type: _actions.REMOVE,
        payload: _extends({}, actionToRetry)
      };
      dispatch(actionToRemove);
      dispatch(actionToRetry);
    }
  }

  return nextResult;
}

function isQueueable(_ref6) {
  var action = _ref6.action;


  var isInScope = _lodash2.default.get(action, ['meta', 'queue', 'enqueue'], false);
  var ttl = (0, _ramda.view)((0, _ramda.lensPath)(['meta', 'queue', 'ttl']), action);

  var isAlive = ttl ? (0, _moment2.default)(ttl).isSameOrAfter() : true;

  return isInScope && isAlive;
}

function queue(_ref7) {
  var getState = _ref7.getState,
      dispatch = _ref7.dispatch,
      next = _ref7.next,
      action = _ref7.action,
      config = _ref7.config;


  var enhacedAction = action;

  if (isFirstTime(action)) {
    enhacedAction = (0, _enhanceAction.enhaceInitial)(action);
  }

  var nextResult = next(enhacedAction);

  var actionToQueue = {
    type: _actions.QUEUE_ACTION,
    payload: _extends({}, enhacedAction)
  };

  dispatch(actionToQueue);

  return nextResult;
}

function isFirstTime(action) {
  return (0, _ramda.view)((0, _ramda.lensPath)(['meta', 'queue', 'times']), action) === undefined;
}