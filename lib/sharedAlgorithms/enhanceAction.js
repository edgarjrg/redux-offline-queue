'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.enhace = enhace;
exports.enhaceInitial = enhaceInitial;

var _v = require('uuid/v1');

var _v2 = _interopRequireDefault(_v);

var _ramda = require('ramda');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function enhace(action) {

    return (0, _ramda.over)((0, _ramda.lensPath)(['meta', 'queue']), function (meta) {
        return _extends({}, meta, {
            id: meta.id || (0, _v2.default)(),
            times: (meta.times || 0) + 1,
            ttl: meta.ttl || (0, _moment2.default)().toISOString(),
            throttle: (0, _moment2.default)().add(1, 'minute').toISOString()
        });
    }, action);
}

function enhaceInitial(action) {

    return (0, _ramda.over)((0, _ramda.lensPath)(['meta', 'queue']), function (meta) {
        return _extends({}, meta, {
            id: meta.id || (0, _v2.default)(),
            times: meta.times || 0
        });
    }, action);
}