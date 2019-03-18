import { times, range, map, last, over, lensPath, init, view, pipe, omit, set } from "ramda";

import {
    ANY_NON_QUEUEABLE_ACTION,
    ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE,
    ANY_QUEUEABLE_ACTION_IN_QUEUE,
    AUTO_ENQUEUE_TRUE,
    AUTO_ENQUEUE_FALSE,
    RETRY_ALL,
    ENQUEUE_ACTION_NOT_IN_QUEUE,
    ENQUEUE_ACTION_IN_QUEUE,
    RETRY_ACTION_NOT_IN_QUEUE,
    RETRY_ACTION_IN_QUEUE,
    REMOVE_ACTION_NOT_IN_QUEUE,
    REMOVE_ACTION_IN_QUEUE,
    ACTION_IN_QUEUE,
    generateAction,
    CONSUME_FIRST_FROM_QUEUE,
} from "./utils/actions";

import { actionsLeft, incrementMetaCounter, passThroughPipeline } from "./utils/utils";
import faker from 'faker'
import uuid from 'uuid/v1'
import moment from 'moment'

describe('from sixth state', () => {

    function generateAnySuspendSagaState() {
        return {
            offline: {
                suspendSaga: true,
                queue: generateAnyQueue()
            }
        }
    }

    function generateAnyQueue() {
        return map(
            x => generateRandomPossibleElementInQueue()
            ,
            range(0, faker.random.number(100))
        )
    }

    function generateRandomPossibleElementInQueue() {
        return {
            type: faker.random.word(),
            meta: {
                queue: {
                    enqueue: true,
                    id: uuid(),
                    times: 10,
                    ttl: generateRandomTime(),
                    throttle: generateRandomTime()
                }
            }
        }
    }

    function generateRandomTime() {
        const now = moment()

        return faker.random.arrayElement([now.clone().toISOString(), now.clone().subtract(1, 'day').toISOString(), now.clone().add(1, 'day').toISOString()])
    }

    describe(ANY_NON_QUEUEABLE_ACTION, () => {

        it('should go to sixth state', () => {

            times(
                () => {
                    const state = generateAnySuspendSagaState()
                    const action = generateAction(ANY_NON_QUEUEABLE_ACTION)

                    const pipeline = passThroughPipeline(state, action)

                    expect(pipeline.store.getState()).toEqual(state)

                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const state = generateAnySuspendSagaState()
                const action = generateAction(ANY_NON_QUEUEABLE_ACTION)
                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                    [action],
                ])
            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {


                const state = generateAnySuspendSagaState()
                const action = generateAction(ANY_NON_QUEUEABLE_ACTION)
                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action],
                ])

            },
                100
            )

        })

    })

    describe(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to sixth state', () => {

            times(
                () => {
                    const state = generateAnySuspendSagaState()
                    const action = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE)

                    const pipeline = passThroughPipeline(state, action)

                    const resultState = pipeline.store.getState()
                    const resultStateWithoutLastElementInQueue = over(
                        lensPath(['offline', 'queue']),
                        init,
                        resultState
                    )
                    const lastElementInResult = pipe(
                        view(lensPath(['offline', 'queue'])),
                        last
                    )(resultState)

                    expect(resultStateWithoutLastElementInQueue).toEqual(state)

                    expect(lastElementInResult).toMatchObject(action)
                    expect(lastElementInResult).toHaveProperty('meta.queue.id')
                    expect(lastElementInResult).toHaveProperty('meta.queue.times', 1)
                    expect(lastElementInResult).toHaveProperty('meta.queue.ttl')
                    expect(lastElementInResult).toHaveProperty('meta.queue.throttle')
                    expect(moment(lastElementInResult.meta.queue.ttl, moment.ISO_8601, true).isValid()).toBeTruthy()
                    expect(moment(lastElementInResult.meta.queue.throttle, moment.ISO_8601, true).isValid()).toBeTruthy()
                    expect(moment(lastElementInResult.meta.queue.throttle).diff(moment(), 'minutes', true)).toBeGreaterThan(0)
                    expect(moment(lastElementInResult.meta.queue.throttle).diff(moment(), 'minutes', true)).toBeLessThanOrEqual(1)

                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const state = generateAnySuspendSagaState()
                const action = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE)

                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(2)
                expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                    [action],
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, [action])],
                ])
            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {
                const state = generateAnySuspendSagaState()
                const action = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE)

                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, [action])],
                ])
            },
                100
            )

        })

    })

    describe(ANY_QUEUEABLE_ACTION_IN_QUEUE, () => {

        it('should go to sixth state', () => {

            times(
                () => {
                    const state = generateAnySuspendSagaState()
                    const queue = view(lensPath(['offline', 'queue']), state)

                    if (queue.length > 0) {
                        const action = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, queue)
                        const pipeline = passThroughPipeline(state, action)
                        const resultState = pipeline.store.getState()

                        const resultStateWithoutLastElementInQueue = over(
                            lensPath(['offline', 'queue']),
                            init,
                            resultState
                        )

                        const lastElementInResult = pipe(
                            view(lensPath(['offline', 'queue'])),
                            last
                        )(resultState)

                        const actionWithoutThrottle = over(
                            lensPath(['meta', 'queue']),
                            omit(['throttle']),
                            action
                        )

                        expect(resultStateWithoutLastElementInQueue).toEqual(state)

                        expect(lastElementInResult).toMatchObject(incrementMetaCounter(actionWithoutThrottle))
                        expect(moment(lastElementInResult.meta.queue.throttle).diff(moment(), 'minutes', true)).toBeGreaterThan(0)
                        expect(moment(lastElementInResult.meta.queue.throttle).diff(moment(), 'minutes', true)).toBeLessThanOrEqual(1)
                    } else {
                        // impossible state if no actions are queued
                    }

                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const state = generateAnySuspendSagaState()
                const queue = view(lensPath(['offline', 'queue']), state)

                if (queue.length > 0) {
                    const action = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, queue)
                    const pipeline = passThroughPipeline(state, action)

                    expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(2)
                    expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                        [generateAction(CONSUME_FIRST_FROM_QUEUE, [action])],
                        [generateAction(ENQUEUE_ACTION_IN_QUEUE, [action])],
                    ])
                } else {
                    // impossible state if no actions are queued
                }

            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {
                const state = generateAnySuspendSagaState()
                const queue = view(lensPath(['offline', 'queue']), state)

                if (queue.length > 0) {
                    const action = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, queue)
                    const pipeline = passThroughPipeline(state, action)

                    expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                    expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                        [generateAction(ENQUEUE_ACTION_IN_QUEUE, [action])],
                    ])
                } else {
                    // impossible state if no actions are queued
                }

            },
                100
            )

        })

    })

    describe(AUTO_ENQUEUE_TRUE, () => {

        it('should go to fift state', () => {

            times(
                () => {
                    const state = generateAnySuspendSagaState()

                    const action = generateAction(AUTO_ENQUEUE_TRUE)
                    const pipeline = passThroughPipeline(state, action)
                    const resultState = pipeline.store.getState()

                    expect(resultState).toEqual(state)

                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const state = generateAnySuspendSagaState()

                const action = generateAction(AUTO_ENQUEUE_TRUE)
                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                    [action]
                ])
            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {

                const state = generateAnySuspendSagaState()

                const action = generateAction(AUTO_ENQUEUE_TRUE)
                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action],
                ])
            },
                100
            )

        })

    })

    describe(AUTO_ENQUEUE_FALSE, () => {

        it('should go to sixth state', () => {

            times(
                () => {
                    const state = generateAnySuspendSagaState()

                    const action = generateAction(AUTO_ENQUEUE_FALSE)
                    const pipeline = passThroughPipeline(state, action)
                    const resultState = pipeline.store.getState()

                    const stateWithSagaNotSuspended = set(
                        lensPath(['offline', 'suspendSaga']),
                        false,
                        state
                    )

                    expect(resultState).toEqual(stateWithSagaNotSuspended)

                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const state = generateAnySuspendSagaState()

                const action = generateAction(AUTO_ENQUEUE_FALSE)
                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                    [action]
                ])
            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {

                const state = generateAnySuspendSagaState()

                const action = generateAction(AUTO_ENQUEUE_FALSE)
                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action],
                ])
            },
                100
            )

        })

    })

    describe(RETRY_ALL, () => {

        it('should go to fift state', () => {

            times(() => {
                const state = generateAnySuspendSagaState()

                const action = generateAction(RETRY_ALL)
                const pipeline = passThroughPipeline(state, action)
                const resultState = pipeline.store.getState()

                expect(resultState).toEqual(state)

            },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const state = generateAnySuspendSagaState()

                const action = generateAction(RETRY_ALL)
                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                    [action],
                ])
            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {

                const state = generateAnySuspendSagaState()

                const action = generateAction(RETRY_ALL)
                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action],
                ])
            },
                100
            )

        })

    })

    describe(ENQUEUE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to fift state', () => {

            times(
                () => {
                    const state = generateAnySuspendSagaState()

                    const action = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE)
                    const pipeline = passThroughPipeline(state, action)
                    const resultState = pipeline.store.getState()

                    const resultStateWithoutLastElementInQueue = over(
                        lensPath(['offline', 'queue']),
                        init,
                        resultState
                    )

                    const lastElementInResult = pipe(
                        view(lensPath(['offline', 'queue'])),
                        last
                    )(resultState)

                    expect(resultStateWithoutLastElementInQueue).toEqual(state)

                    expect(lastElementInResult).toMatchObject(action.payload)
                    expect(lastElementInResult).toHaveProperty('meta.queue.id')
                    expect(lastElementInResult).toHaveProperty('meta.queue.times', 1)
                    expect(lastElementInResult).toHaveProperty('meta.queue.ttl')
                    expect(lastElementInResult).toHaveProperty('meta.queue.throttle')
                    expect(moment(lastElementInResult.meta.queue.ttl, moment.ISO_8601, true).isValid()).toBeTruthy()
                    expect(moment(lastElementInResult.meta.queue.throttle, moment.ISO_8601, true).isValid()).toBeTruthy()
                    expect(moment(lastElementInResult.meta.queue.throttle).diff(moment(), 'minutes', true)).toBeGreaterThan(0)
                    expect(moment(lastElementInResult.meta.queue.throttle).diff(moment(), 'minutes', true)).toBeLessThanOrEqual(1)

                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const state = generateAnySuspendSagaState()

                const action = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE)
                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                    [action],
                ])
            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {

                const state = generateAnySuspendSagaState()

                const action = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE)
                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action],
                ])
            },
                100
            )

        })

    })

    describe(ENQUEUE_ACTION_IN_QUEUE, () => {

        it('should go to fift state', () => {

            times(
                () => {
                    const state = generateAnySuspendSagaState()
                    const queue = view(lensPath(['offline', 'queue']), state)
                    if (queue.length > 0) {

                        const action = generateAction(ENQUEUE_ACTION_IN_QUEUE, queue)
                        const pipeline = passThroughPipeline(state, action)
                        const resultState = pipeline.store.getState()

                        const resultStateWithoutLastElementInQueue = over(
                            lensPath(['offline', 'queue']),
                            init,
                            resultState
                        )

                        const lastElementInResult = pipe(
                            view(lensPath(['offline', 'queue'])),
                            last
                        )(resultState)

                        const actionWithoutThrottle = over(
                            lensPath(['meta', 'queue']),
                            omit(['throttle']),
                            action.payload
                        )

                        expect(resultStateWithoutLastElementInQueue).toEqual(state)
                        expect(lastElementInResult).toMatchObject(incrementMetaCounter(actionWithoutThrottle))
                        expect(moment(lastElementInResult.meta.queue.throttle).diff(moment(), 'minutes', true)).toBeGreaterThan(0)
                        expect(moment(lastElementInResult.meta.queue.throttle).diff(moment(), 'minutes', true)).toBeLessThanOrEqual(1)
                    } else {
                        // impossible state if no actions are queued
                    }

                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const state = generateAnySuspendSagaState()
                const queue = view(lensPath(['offline', 'queue']), state)
                if (queue.length > 0) {

                    const action = generateAction(ENQUEUE_ACTION_IN_QUEUE, queue)
                    const pipeline = passThroughPipeline(state, action)

                    expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(1)
                    expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                        [action],
                    ])
                } else {
                    // impossible state if no actions are queued
                }
            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {

                const state = generateAnySuspendSagaState()
                const queue = view(lensPath(['offline', 'queue']), state)
                if (queue.length > 0) {

                    const action = generateAction(ENQUEUE_ACTION_IN_QUEUE, queue)
                    const pipeline = passThroughPipeline(state, action)

                    expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                    expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                        [action],
                    ])
                } else {
                    // impossible state if no actions are queued
                }
            },
                100
            )

        })

    })

    describe(RETRY_ACTION_NOT_IN_QUEUE, () => {

        it('should go to fift state', () => {

            times(
                () => {
                    const state = generateAnySuspendSagaState()
                    const queue = view(lensPath(['offline', 'queue']), state)

                    const action = generateAction(RETRY_ACTION_NOT_IN_QUEUE, queue)
                    const pipeline = passThroughPipeline(state, action)
                    const resultState = pipeline.store.getState()

                    expect(resultState).toEqual(state)

                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const state = generateAnySuspendSagaState()
                const queue = view(lensPath(['offline', 'queue']), state)

                const action = generateAction(RETRY_ACTION_NOT_IN_QUEUE, queue)
                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                    [action],
                ])
            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {

                const state = generateAnySuspendSagaState()
                const queue = view(lensPath(['offline', 'queue']), state)

                const action = generateAction(RETRY_ACTION_NOT_IN_QUEUE, queue)
                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action],
                ])
            },
                100
            )

        })

    })

    describe(RETRY_ACTION_IN_QUEUE, () => {

        it('should go to sixth state', () => {

            times(
                () => {
                    const state = generateAnySuspendSagaState()
                    const queue = view(lensPath(['offline', 'queue']), state)

                    const action = generateAction(RETRY_ACTION_IN_QUEUE, queue)
                    const pipeline = passThroughPipeline(state, action)
                    const resultState = pipeline.store.getState()

                    expect(resultState).toEqual(state)

                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const state = generateAnySuspendSagaState()
                const queue = view(lensPath(['offline', 'queue']), state)

                const action = generateAction(RETRY_ACTION_IN_QUEUE, queue)
                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                    [action],
                ])
            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {

                const state = generateAnySuspendSagaState()
                const queue = view(lensPath(['offline', 'queue']), state)

                const action = generateAction(RETRY_ACTION_IN_QUEUE, queue)
                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action],
                ])
            },
                100
            )

        })

    })

    describe(REMOVE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to sixth state', () => {

            times(
                () => {
                    const state = generateAnySuspendSagaState()
                    const queue = view(lensPath(['offline', 'queue']), state)

                    const action = generateAction(REMOVE_ACTION_NOT_IN_QUEUE, queue)
                    const pipeline = passThroughPipeline(state, action)
                    const resultState = pipeline.store.getState()

                    expect(resultState).toEqual(state)
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const state = generateAnySuspendSagaState()
                const queue = view(lensPath(['offline', 'queue']), state)

                const action = generateAction(REMOVE_ACTION_NOT_IN_QUEUE, queue)
                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                    [action],
                ])
            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {

                const state = generateAnySuspendSagaState()
                const queue = view(lensPath(['offline', 'queue']), state)

                const action = generateAction(REMOVE_ACTION_NOT_IN_QUEUE, queue)
                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action],
                ])
            },
                100
            )

        })

    })

    describe(REMOVE_ACTION_IN_QUEUE, () => {

        it('should go to fift state', () => {

            times(
                () => {
                    const state = generateAnySuspendSagaState()
                    const queue = view(lensPath(['offline', 'queue']), state)

                    if (queue.length > 0) {

                        const action = generateAction(REMOVE_ACTION_IN_QUEUE, queue)
                        const pipeline = passThroughPipeline(state, action)
                        const resultState = pipeline.store.getState()

                        const actionLefts = actionsLeft(queue, action)

                        const stateWithoutAction = set(
                            lensPath(['offline', 'queue']),
                            actionLefts,
                            state
                        )

                        expect(resultState).toEqual(stateWithoutAction)
                    } else {

                    }

                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const state = generateAnySuspendSagaState()
                const queue = view(lensPath(['offline', 'queue']), state)

                if (queue.length > 0) {

                    const action = generateAction(REMOVE_ACTION_IN_QUEUE, queue)
                    const pipeline = passThroughPipeline(state, action)

                    expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(1)
                    expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                        [action],
                    ])

                } else {

                }
            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {

                const state = generateAnySuspendSagaState()
                const queue = view(lensPath(['offline', 'queue']), state)

                if (queue.length > 0) {

                    const action = generateAction(REMOVE_ACTION_IN_QUEUE, queue)
                    const pipeline = passThroughPipeline(state, action)

                    expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                    expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                        [action],
                    ])
                } else {

                }

            },
                100
            )

        })

    })

})
