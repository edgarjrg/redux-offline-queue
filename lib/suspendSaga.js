'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = suspendSaga;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _initialState = require('./initialState');

var _initialState2 = _interopRequireDefault(_initialState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Custom wrapper for the saga middleware that can skip firing the saga.
 *
 * In case of the offline action we do want it to be dispatched
 * so that the reducer updates the local state in a optimistic manner.
 *
 * However since we know for sure that the device is offline
 * the corresponding saga should not be fired.
 *
 * For the action to skip the saga it should have:
 * ```
 * suspendSaga: true
 * ```
 * property set.
 *
 * Note: One should wrap the existing saga middleware for this to work correctly,
 * for example:
 * ```
 * const sagaMiddleware = createSagaMiddleware()
 * const suspendSagaMiddleware = suspendSaga(sagaMiddleware)
 * ```
 *
 * @param {Function} middleware Saga middleware.
 */
function suspendSaga(middleware) {
  return function (store) {
    return function (next) {
      return function (action) {
        var delegate = middleware(store)(next);

        if (shouldSuspendSaga(store, action)) {
          return next(action);
        } else {
          return delegate(action);
        }
      };
    };
  };
}

function shouldSuspendSaga(store, action) {
  var _getConfig = (0, _config2.default)(),
      stateName = _getConfig.stateName;

  var state = _lodash2.default.get(store.getState(), stateName, _initialState2.default);

  var suspendSaga = state.suspendSaga;

  var should = _lodash2.default.get(action, 'meta.queue.enqueue', false) === true && suspendSaga;

  return should;
}