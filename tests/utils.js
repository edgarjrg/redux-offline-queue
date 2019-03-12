import reducer from '../src/reducer';
import initialState from '../src/initialState'
import offlineMiddleware from '../src/offlineMiddleware';
import suspendSaga from '../src/suspendSaga';
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { AUTO_ENQUEUE, RETRY_ALL, RETRY, QUEUE_ACTION, RESET_QUEUE } from "../src/actions";
import faker from 'faker';

// export function generateNonQueueableAction() {
//     return {
//         type: 'asdf',
//         payload: 1234
//     }
// }

// export function generateQueueableAction() {
//     return {
//         type: 'asdf',
//         payload: 1234,
//         meta: {
//             queueIfOffline: true
//         }
//     }
// }

// export function generateAUTO_ENQUEUEAction(enabled = false) {
//     return {
//         type: 'redux-offline-queue/AUTO_ENQUEUE',
//         payload: {
//             value: enabled
//         }
//     }
// }

// export function generateAction(type) {
//     switch (type) {
//         case 'non-queueable':
//             return {
//                 type: 'asdf',
//                 payload: 1234
//             }
//         case 'en-queueable':
//             return {
//                 type: 'asdf',
//                 payload: 1234,
//                 meta: {
//                     queueIfOffline: true
//                 }
//             }
//         case 'AUTO_ENQUEUE':
//             return {
//                 type: 'redux-offline-queue/AUTO_ENQUEUE',
//                 payload: {
//                     value: enabled
//                 }
//             }
//         case 'RETRY_ALL':
//             return {
//                 type: 'redux-offline-queue/RETRY_ALL',
//             }
//     }
// }

// export function shouldAddElementToTheQueue(initialState, action, expectedState1, expectedState2) {

//     let state = reducer({ ...initialState })

//     expect(state).toEqual(expectedState1)

//     state = reducer(state, action)

//     expect(state).toEqual(expectedState2)

// }

// export function shouldCallSagaWithAction(inputAction) {
//     const sagaSpy = jest.fn();

//     const sagaMiddleware = store => next => action => {
//         sagaSpy(action);
//         return next(action)
//     }

//     const next = jest.fn()
//     const next2 = jest.fn()
//     const middleware = offlineMiddleware();
//     const suspendSagaMiddlewate = suspendSaga(sagaMiddleware)
//     const dispatch = jest.fn()

//     middleware({
//         getState: () => ({ offline: initialState }),
//         dispatch
//     })(next)(inputAction)

//     expect(dispatch).not.toHaveBeenCalled()
//     expect(next).toHaveBeenCalledTimes(1)
//     expect(next).toHaveBeenCalledWith(inputAction)

//     const passedAction = next.mock.calls[0][0]

//     suspendSagaMiddlewate()(next2)(passedAction)

//     expect(sagaSpy).toHaveBeenCalledTimes(1)
//     expect(sagaSpy).toHaveBeenCalledWith(inputAction)

//     expect(next2).toHaveBeenCalledTimes(1)
//     expect(next2).toHaveBeenCalledWith(inputAction)

// }


// export function shouldCallReducerWithAction(inputAction) {

//     const sagaSpy = jest.fn();

//     const sagaMiddleware = store => next => action => {
//         sagaSpy(action);
//         return next(action)
//     }

//     const next = jest.fn()
//     const next2 = jest.fn()
//     const middleware = offlineMiddleware();
//     const suspendSagaMiddlewate = suspendSaga(sagaMiddleware)
//     const dispatch = jest.fn()

//     middleware({
//         getState: () => initialState,
//         dispatch
//     })(next)(inputAction)

//     expect(dispatch).not.toHaveBeenCalled()
//     expect(next).toHaveBeenCalledTimes(1)
//     expect(next).toHaveBeenCalledWith(inputAction)

//     const passedAction = next.mock.calls[0][0]

//     suspendSagaMiddlewate()(next2)(passedAction)

//     expect(sagaSpy).toHaveBeenCalledTimes(1)
//     expect(sagaSpy).toHaveBeenCalledWith(inputAction)

//     expect(next2).toHaveBeenCalledTimes(1)
//     expect(next2).toHaveBeenCalledWith(inputAction)

// }

// export function shouldCallEnqueueTransform(inputAction) {

//     const enqueueTransformSpy = jest.fn()

//     const next = jest.fn()

//     const middleware = offlineMiddleware({
//         enqueueTransform: enqueueTransformSpy
//     });

//     const dispatch = jest.fn()

//     middleware({
//         getState: () => initialState,
//         dispatch
//     })(next)(inputAction)

//     expect(dispatch).not.toHaveBeenCalled()
//     expect(next).toHaveBeenCalledTimes(1)
//     expect(next).toHaveBeenCalledWith(inputAction)

//     expect(enqueueTransformSpy).not.toHaveBeenCalled()

// }

// export function shouldCallDequeuePredicate(inputAction) {

//     const dequeuePredicateSpy = jest.fn()

//     const next = jest.fn()

//     const middleware = offlineMiddleware({
//         dequeuePredicate: dequeuePredicateSpy
//     });

//     const dispatch = jest.fn()

//     middleware({
//         getState: () => initialState,
//         dispatch
//     })(next)(inputAction)

//     expect(dispatch).not.toHaveBeenCalled()
//     expect(next).toHaveBeenCalledTimes(1)
//     expect(next).toHaveBeenCalledWith(inputAction)

//     expect(dequeuePredicateSpy).not.toHaveBeenCalled()
// }

export function wholePipeline() {

    const gotToReducerSpy = jest.fn();
    const sagaMiddlewareSpy = jest.fn()
    const store = createStore(
        combineReducers({
            offline: reducer
        }),
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


export function InitialState2InitialStateActions() {

    return faker.random.arrayElement([
        generateAutoEnqueueActionFalse(),
        generateRetryAllAction(),
        generateNonQueueableAction()
    ])

}

export function InitialState2SecondStateActions() {

    return faker.random.arrayElement([
        generateAutoEnqueueActionTrue()
    ])

}

export function InitialState2ThirdStateActions(queue) {

    return faker.random.arrayElement([
        generateEnqueueActionActionNotInQueue(queue)
    ])

}




function generateQueueableAction() {
    return {
        type: faker.random.word(),
        payload: {
            queue: {
                enqueue: true
            }
        }
    }
}


function generateNonQueueableAction(queue) {
    return {
        type: faker.random.word(),
        payload: faker.random.word(),
    }
}


function generateQueueableActionInQueue(queue) {

    return faker.random.arrayElement(queue)

}


function generateQueueableActionNotInQueue(queue) {
    return {
        type: faker.random.word(),
        payload: {
            queue: {
                enqueue: true
            }
        }
    }
}

function generateAutoEnqueueActionTrue() {
    return {
        type: AUTO_ENQUEUE,
        payload: {
            value: true
        }
    }
}

function generateAutoEnqueueActionFalse() {
    return {
        type: AUTO_ENQUEUE,
        payload: {
            value: false
        }
    }
}

function generateRetryAllAction() {
    return {
        type: RETRY_ALL
    }
}

function generateEnqueueActionActionNotInQueue(queue) {
    return {
        type: QUEUE_ACTION,
        payload: {
            ...generateQueueableActionNotInQueue(queue)
        }
    }
}

function generateEnqueueActionActionInQueue(queue) {
    if (actionToQueue) {
        return {
            type: QUEUE_ACTION,
            payload: generateQueueableActionInQueue(queue)
        }

    }
}

function generateRetryActionActionNotInQueue(queue) {
    return {
        type: RETRY,
        payload: generateQueueableActionNotInQueue(queue)
    }
}

function generateRetryActionActionInQueue(queue) {

    return {
        type: RETRY,
        payload: generateQueueableActionInQueue(queue)
    }

}

export function FirstState2ThirdStateActions() {

}

export function FirstState2FirstStateBeforeEach() {
    const action = InitialState2InitialStateActions();
    const startState = { offline: { ...initialState } }
    const pipeline = wholePipeline()

    pipeline.store.dispatch(action)

    return {
        action,
        startState,
        pipeline
    }
}

export function FirstState2SecondStateBeforeEach() {
    const startState = { offline: { ...initialState } }
    const action = InitialState2ThirdStateActions([]);
    const pipeline = wholePipeline()

    pipeline.store.dispatch(action)

    return {
        action,
        startState,
        pipeline
    }
}

export function FirstState2ThirdStateBeforeEach() {
    const action = FirstState2ThirdStateActions();
    const startState = { offline: { ...initialState } }
    const pipeline = wholePipeline()

    pipeline.store.dispatch(action)

    return {
        action,
        startState,
        pipeline
    }
}

export function FirstState2FourthStateBeforeEach() {
    const action = InitialState2SecondStateActions();
    const startState = { offline: { ...initialState } }
    const pipeline = wholePipeline()

    pipeline.store.dispatch(action)

    return {
        action,
        startState,
        pipeline
    }
}

export function FirstState2FifthStateBeforeEach() {

}

export function FirstState2SixthStateBeforeEach() {

}