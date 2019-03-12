import reducer from '../src/reducer';
import initialState from '../src/initialState'
import offlineMiddleware from '../src/offlineMiddleware';
import suspendSaga from '../src/suspendSaga';
import { cloneDeep } from 'lodash'

// external actions
describe('initial state', () => {

    it('', () => {
        expect(initialState).toEqual({ autoEnqueue: false, queue: [] })
    })

    it('should have auto_enqueue = false', () => {
        const state = reducer()

        expect(state).toEqual({ autoEnqueue: false, queue: [] })
    })
})

describe('auto enqueue = false', () => {
    // external actions
    describe('{type: ANY non-queueble }', () => {
        it('should change auto_enque action = false', () => {

            const state = reducer(initialState, generateNonQueueableAction())

            expect(state).toEqual({ autoEnqueue: false, queue: [] })
        })

        it('should add this element to the queue = false', () => {
            const queableAction = generateQueueableAction();
            const queableAction2 = generateQueueableAction();
            const nonqueableAction = generateNonQueueableAction();

            let state = reducer({ ...initialState, queue: [queableAction] })

            expect(state).toEqual({ autoEnqueue: false, queue: [queableAction] })

            state = reducer(state, queableAction2)

            expect(state).toEqual({ autoEnqueue: false, queue: [queableAction] })

            state = reducer(state, nonqueableAction)

            expect(state).toEqual({ autoEnqueue: false, queue: [queableAction] })
        })

        it('should add other element to the queue = false', () => {
            const queableAction = generateQueueableAction();
            const queableAction2 = generateQueueableAction();
            const nonqueableAction = generateNonQueueableAction();

            let state = reducer({ ...initialState, queue: [queableAction] })

            expect(state).toEqual({ autoEnqueue: false, queue: [queableAction] })

            state = reducer(state, queableAction2)

            expect(state).toEqual({ autoEnqueue: false, queue: [queableAction] })

            state = reducer(state, nonqueableAction)

            expect(state).toEqual({ autoEnqueue: false, queue: [queableAction] })
        })

        it('should remove this element to the queue = false', () => {
            const queableAction = generateQueueableAction();
            const queableAction2 = generateQueueableAction();
            const nonqueableAction = generateNonQueueableAction();

            let state = reducer({ ...initialState, queue: [queableAction] })

            expect(state).toEqual({ autoEnqueue: false, queue: [queableAction] })

            state = reducer(state, queableAction2)

            expect(state).toEqual({ autoEnqueue: false, queue: [queableAction] })

            state = reducer(state, nonqueableAction)

            expect(state).toEqual({ autoEnqueue: false, queue: [queableAction] })
        })

        it('should remove other element to the queue = false', () => {
            const queableAction = generateQueueableAction();
            const queableAction2 = generateQueueableAction();
            const nonqueableAction = generateNonQueueableAction();

            let state = reducer({ ...initialState, queue: [queableAction] })

            expect(state).toEqual({ autoEnqueue: false, queue: [queableAction] })

            state = reducer(state, queableAction2)

            expect(state).toEqual({ autoEnqueue: false, queue: [queableAction] })

            state = reducer(state, nonqueableAction)

            expect(state).toEqual({ autoEnqueue: false, queue: [queableAction] })
        })

        it('should execute this action sagas = true', () => {
            const nonqueableAction = generateNonQueueableAction();
            const sagaSpy = jest.fn();

            const sagaMiddleware = store => next => action => {
                sagaSpy(action);
                return next(action)
            }

            const next = jest.fn()
            const next2 = jest.fn()
            const middleware = offlineMiddleware();
            const suspendSagaMiddlewate = suspendSaga(sagaMiddleware)
            const dispatch = jest.fn()

            middleware({
                getState: () => initialState,
                dispatch
            })(next)(nonqueableAction)

            expect(dispatch).not.toHaveBeenCalled()
            expect(next).toHaveBeenCalledTimes(1)
            expect(next).toHaveBeenCalledWith(nonqueableAction)

            const passedAction = next.mock.calls[0][0]

            suspendSagaMiddlewate()(next2)(passedAction)

            expect(sagaSpy).toHaveBeenCalledTimes(1)
            expect(sagaSpy).toHaveBeenCalledWith(nonqueableAction)

            expect(next2).toHaveBeenCalledTimes(1)
            expect(next2).toHaveBeenCalledWith(nonqueableAction)

        })

        it('should execute this action reducers = true', () => {
            const nonqueableAction = generateNonQueueableAction();
            const sagaSpy = jest.fn();

            const sagaMiddleware = store => next => action => {
                sagaSpy(action);
                return next(action)
            }

            const next = jest.fn()
            const next2 = jest.fn()
            const middleware = offlineMiddleware();
            const suspendSagaMiddlewate = suspendSaga(sagaMiddleware)
            const dispatch = jest.fn()

            middleware({
                getState: () => initialState,
                dispatch
            })(next)(nonqueableAction)

            expect(dispatch).not.toHaveBeenCalled()
            expect(next).toHaveBeenCalledTimes(1)
            expect(next).toHaveBeenCalledWith(nonqueableAction)

            const passedAction = next.mock.calls[0][0]

            suspendSagaMiddlewate()(next2)(passedAction)

            expect(sagaSpy).toHaveBeenCalledTimes(1)
            expect(sagaSpy).toHaveBeenCalledWith(nonqueableAction)

            expect(next2).toHaveBeenCalledTimes(1)
            expect(next2).toHaveBeenCalledWith(nonqueableAction)


        })

        it('should execute enqueue middelware = false', () => {

            const nonqueableAction = generateNonQueueableAction();
            const enqueueTransformSpy = jest.fn()

            const next = jest.fn()

            const middleware = offlineMiddleware({
                enqueueTransform: enqueueTransformSpy
            });

            const dispatch = jest.fn()

            middleware({
                getState: () => initialState,
                dispatch
            })(next)(nonqueableAction)

            expect(dispatch).not.toHaveBeenCalled()
            expect(next).toHaveBeenCalledTimes(1)
            expect(next).toHaveBeenCalledWith(nonqueableAction)

            expect(enqueueTransformSpy).not.toHaveBeenCalled()

        })

        it('should execute dequeue middelware = false', () => {
            const nonqueableAction = generateNonQueueableAction();
            const dequeuePredicateSpy = jest.fn()

            const next = jest.fn()

            const middleware = offlineMiddleware({
                dequeuePredicate: dequeuePredicateSpy
            });

            const dispatch = jest.fn()

            middleware({
                getState: () => initialState,
                dispatch
            })(next)(nonqueableAction)

            expect(dispatch).not.toHaveBeenCalled()
            expect(next).toHaveBeenCalledTimes(1)
            expect(next).toHaveBeenCalledWith(nonqueableAction)

            expect(dequeuePredicateSpy).not.toHaveBeenCalled()
        })
    })

    describe('{type: ANY queueble }', () => {
        it('should change auto_enque action = false', () => {
            const state = reducer(initialState, generateNonQueueableAction())

            expect(state).toEqual({ autoEnqueue: false, queue: [] })
        })

        it('should add this element to the queue = false', () => {
            const queableAction = generateQueueableAction();
            const queableAction2 = generateQueueableAction();
            const initialState = { ...initialState, queue: [queableAction] }
            const expectedState = cloneDeep(initialState);
            shouldAddElementToTheQueue(initialState, queableAction2, expectedState, expectedState)
        })

        it('should remove this element to the queue = false', () => {
            const queableAction = generateQueueableAction();
            const queableAction2 = generateQueueableAction();
            const initialState = { ...initialState, queue: [queableAction] }
            const expectedState = cloneDeep(initialState);
            shouldAddElementToTheQueue(initialState, queableAction2, expectedState, expectedState)
        })

        it('should execute this action sagas = true', () => {
            shouldCallSagaWithAction(generateQueueableAction())
        })
        it('should execute this action reducers = true', () => {
            shouldCallReducerWithAction(generateQueueableAction());
        })
        it('should execute enqueue middelware = false', () => {
            shouldCallEnqueueTransform(generateQueueableAction())
        })
        it('should execute dequeue middelware = false', () => {
            shouldCallDequeuePredicate(generateQueueableAction());
        })
    })

    describe('{type: AUTO_ENQUEUE, payload: {value: "DISABLED"}}', () => {
        it('should change auto_enque action = false', () => {
            const state = reducer(initialState, generateAUTO_ENQUEUEAction())

            expect(state).toEqual({ autoEnqueue: false, queue: [] })
        })
        it('should add this element to the queue = false', () => {
            const queableAction = generateQueueableAction();
            const state = {
                ...initialState,
                queue: [queableAction]
            }
            const expectedState = cloneDeep(state);
            shouldAddElementToTheQueue
                (
                    state,
                    generateAUTO_ENQUEUEAction(false),
                    expectedState,
                    expectedState
                )

        })

        it('should remove this element to the queue = false', () => {
            const queableAction = generateQueueableAction();
            const state = {
                ...initialState,
                queue: [queableAction]
            }
            const expectedState = cloneDeep(state);
            shouldAddElementToTheQueue
                (
                    state,
                    generateAUTO_ENQUEUEAction(false),
                    expectedState,
                    expectedState
                )
        })


        it('should execute this action sagas = true', () => {
            shouldCallSagaWithAction(generateAUTO_ENQUEUEAction())
        })

        it('should execute this action reducers = true', () => {
            shouldCallReducerWithAction(generateAUTO_ENQUEUEAction());
        })
        it('should execute enqueue middelware = false', () => {
            shouldCallEnqueueTransform(generateAUTO_ENQUEUEAction())
        })
        it('should execute dequeue middelware = false', () => {
            shouldCallDequeuePredicate(generateAUTO_ENQUEUEAction());

        })
    })

    describe('{type: AUTO_ENQUEUE, payload: {value: "ENABLED"}}', () => {
        it('should change auto_enque action = true', () => {
            const state = reducer(initialState, generateAUTO_ENQUEUEAction(true))

            expect(state).toEqual({ autoEnqueue: true, queue: [] })
        })
        it('should add this element to the queue = false', () => {

            const queableAction = generateQueueableAction(true);
            const state = {
                ...initialState,
                queue: [queableAction]
            }
            const expectedState = { ...state, autoEnqueue: true };

            shouldAddElementToTheQueue
                (
                    state,
                    generateAUTO_ENQUEUEAction(true),
                    state,
                    expectedState
                )

        })
        it('should remove this element to the queue = false', () => {
            const queableAction = generateQueueableAction(true);
            const state = {
                ...initialState,
                queue: [queableAction]
            }
            const expectedState = { ...state, autoEnqueue: true };

            shouldAddElementToTheQueue
                (
                    state,
                    generateAUTO_ENQUEUEAction(true),
                    state,
                    expectedState
                )
        })

        it('should execute this action sagas = true', () => {
            shouldCallSagaWithAction(generateAUTO_ENQUEUEAction(true))
        })

        it('should execute this action reducers = true', () => {
            shouldCallReducerWithAction(generateAUTO_ENQUEUEAction(true));
        })
        it('should execute enqueue middelware = false', () => {
            shouldCallEnqueueTransform(generateAUTO_ENQUEUEAction(true))

        })
        it('should execute dequeue middelware = false', () => {
            shouldCallDequeuePredicate(generateAUTO_ENQUEUEAction(true));
        })
    })

    describe('{type: RETRY_ALL}', () => {
        it('should change auto_enque action = false', () => {
            const state = reducer(initialState, generateAction('RETRY_ALL'))

            expect(state).toEqual({ autoEnqueue: false, queue: [] })
        })

        it('should add this element to the queue = false', () => {
            const state = {
                ...initialState,
                queue: []
            }
            const expectedState = cloneDeep(state);
            shouldAddElementToTheQueue
                (
                    state,
                    generateAction('RETRY_ALL'),
                    expectedState,
                    expectedState
                )

        })

        it('should remove all elements of the queue = false', () => {
            const queableAction = generateQueueableAction();
            const state = {
                ...initialState,
                queue: [queableAction]
            }
            const expectedState = cloneDeep(state);
            shouldAddElementToTheQueue
                (
                    state,
                    generateAction('RETRY_ALL'),
                    expectedState,
                    expectedState
                )
        })

        it.only('should execute this action sagas = true', () => {
            shouldCallSagaWithAction(generateAction('RETRY_ALL'))
        })

        it.skip('should execute this action reducers = true', () => {
            shouldCallReducerWithAction(generateAUTO_ENQUEUEAction());
        })
        it.skip('should execute enqueue middelware = false', () => {
            shouldCallEnqueueTransform(generateAUTO_ENQUEUEAction())
        })
        it.skip('should execute dequeue middelware = false', () => {
            shouldCallDequeuePredicate(generateAUTO_ENQUEUEAction());

        })
    })

    // // internal actions
    // describe('{type: ENQUEUE_ACTION, payload: {...action}}', () => {
    //     it('should change auto_enque action = false')
    //     it('should change queue = true')
    //     it('should queue this action = true')
    //     it('should execute this action sagas = false')
    //     it('should execute this action reducers = true')
    //     it('should execute enqueue middelware = true')
    //     it('should execute dequeue middelware = false')
    // })

    // describe('{type: RETRY, payload: {hash: id1}', () => {
    //     it('should change auto_enque action = false')
    //     it('should change queue = true')
    //     it('should queue this action = false')
    //     it('should execute this action sagas = true')
    //     it('should execute this action reducers = true')
    //     it('should execute enqueue middelware = false')
    //     it('should execute dequeue middelware = true')
    // })

})




export function generateNonQueueableAction() {
    return {
        type: 'asdf',
        payload: 1234
    }
}

export function generateQueueableAction() {
    return {
        type: 'asdf',
        payload: 1234,
        meta: {
            queueIfOffline: true
        }
    }
}

export function generateAUTO_ENQUEUEAction(enabled = false) {
    return {
        type: 'redux-offline-queue/AUTO_ENQUEUE',
        payload: {
            value: enabled
        }
    }
}

export function generateAction(type) {
    switch (type) {
        case 'non-queueable':
            return {
                type: 'asdf',
                payload: 1234
            }
        case 'en-queueable':
            return {
                type: 'asdf',
                payload: 1234,
                meta: {
                    queueIfOffline: true
                }
            }
        case 'AUTO_ENQUEUE':
            return {
                type: 'redux-offline-queue/AUTO_ENQUEUE',
                payload: {
                    value: enabled
                }
            }
        case 'RETRY_ALL':
            return {
                type: 'redux-offline-queue/RETRY_ALL',
            }
    }
}

export function shouldAddElementToTheQueue(initialState, action, expectedState1, expectedState2) {

    let state = reducer({ ...initialState })

    expect(state).toEqual(expectedState1)

    state = reducer(state, action)

    expect(state).toEqual(expectedState2)

}

export function shouldCallSagaWithAction(inputAction) {
    const sagaSpy = jest.fn();

    const sagaMiddleware = store => next => action => {
        sagaSpy(action);
        return next(action)
    }

    const next = jest.fn()
    const next2 = jest.fn()
    const middleware = offlineMiddleware();
    const suspendSagaMiddlewate = suspendSaga(sagaMiddleware)
    const dispatch = jest.fn()

    middleware({
        getState: () => ({ offline: initialState }),
        dispatch
    })(next)(inputAction)

    expect(dispatch).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(inputAction)

    const passedAction = next.mock.calls[0][0]

    suspendSagaMiddlewate()(next2)(passedAction)

    expect(sagaSpy).toHaveBeenCalledTimes(1)
    expect(sagaSpy).toHaveBeenCalledWith(inputAction)

    expect(next2).toHaveBeenCalledTimes(1)
    expect(next2).toHaveBeenCalledWith(inputAction)

}


export function shouldCallReducerWithAction(inputAction) {

    const sagaSpy = jest.fn();

    const sagaMiddleware = store => next => action => {
        sagaSpy(action);
        return next(action)
    }

    const next = jest.fn()
    const next2 = jest.fn()
    const middleware = offlineMiddleware();
    const suspendSagaMiddlewate = suspendSaga(sagaMiddleware)
    const dispatch = jest.fn()

    middleware({
        getState: () => initialState,
        dispatch
    })(next)(inputAction)

    expect(dispatch).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(inputAction)

    const passedAction = next.mock.calls[0][0]

    suspendSagaMiddlewate()(next2)(passedAction)

    expect(sagaSpy).toHaveBeenCalledTimes(1)
    expect(sagaSpy).toHaveBeenCalledWith(inputAction)

    expect(next2).toHaveBeenCalledTimes(1)
    expect(next2).toHaveBeenCalledWith(inputAction)

}

export function shouldCallEnqueueTransform(inputAction) {

    const enqueueTransformSpy = jest.fn()

    const next = jest.fn()

    const middleware = offlineMiddleware({
        enqueueTransform: enqueueTransformSpy
    });

    const dispatch = jest.fn()

    middleware({
        getState: () => initialState,
        dispatch
    })(next)(inputAction)

    expect(dispatch).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(inputAction)

    expect(enqueueTransformSpy).not.toHaveBeenCalled()

}

export function shouldCallDequeuePredicate(inputAction) {

    const dequeuePredicateSpy = jest.fn()

    const next = jest.fn()

    const middleware = offlineMiddleware({
        dequeuePredicate: dequeuePredicateSpy
    });

    const dispatch = jest.fn()

    middleware({
        getState: () => initialState,
        dispatch
    })(next)(inputAction)

    expect(dispatch).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(inputAction)

    expect(dequeuePredicateSpy).not.toHaveBeenCalled()
}