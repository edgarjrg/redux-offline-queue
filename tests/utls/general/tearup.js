import reducer from '../../../src/reducer';
import offlineMiddleware from '../../../src/offlineMiddleware';
import suspendSaga from '../../../src/suspendSaga';
import { createStore, applyMiddleware, combineReducers } from 'redux'

export function wholePipeline(preloadState) {

    const gotToReducerSpy = jest.fn();
    const sagaMiddlewareSpy = jest.fn()
    const store = createStore(
        combineReducers({
            offline: reducer
        }),
        preloadState,
        applyMiddleware(
            offlineMiddleware(),
            suspendSaga(
                store => next => action => {
                    sagaMiddlewareSpy(action);
                    return next(action)
                }
            ),
            store => next => action => {
                gotToReducerSpy(action)
                return next(action)
            })
    );

    return {
        store,
        dispatchSpy: jest.spyOn(store, 'dispatch'),
        gotToReducerSpy,
        sagaMiddlewareSpy
    }
}

