'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reducer;

var _reduxPersist = require('redux-persist');

var _lodash = require('lodash');

var _initialState = require('./initialState');

var _initialState2 = _interopRequireDefault(_initialState);

var _actions = require('./actions');

var _enhanceAction = require('./sharedAlgorithms/enhanceAction');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Reducer for the offline queue.
 *
 * @param {Object} state Offline queue Redux store state.
 * @param {Object} action Action that was dispatched to the store.
 */
function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _initialState2.default;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  switch (action.type) {
    case _actions.RESET:
      return _extends({}, _initialState2.default);
    case _reduxPersist.REHYDRATE:
      {
        // Handle rehydrating with custom shallow merge.

        if (action.payload && action.payload.offline) {
          return _extends({}, state, action.payload.offline);
        }

        return state;
      }
    case _actions.SUSPEND_SAGA:
      {
        return _extends({}, state, { suspendSaga: action.payload.value });
      }
    case _actions.QUEUE_ACTION:
      return _extends({}, state, { queue: state.queue.concat((0, _enhanceAction.enhace)(action.payload)) });
    case _actions.REMOVE:
      return removeFromQueue(state, action);
    case _actions.RETRY:
      return state;
    default:
      return state;
  }
}

function removeFromQueue(state, action) {
  var removeId = (0, _lodash.get)(action, 'payload.meta.queue.id');
  return _extends({}, state, {
    queue: (0, _lodash.filter)(state.queue, function (action) {
      var actionId = (0, _lodash.get)(action, 'meta.queue.id');
      return removeId !== actionId;
    })
  });
}