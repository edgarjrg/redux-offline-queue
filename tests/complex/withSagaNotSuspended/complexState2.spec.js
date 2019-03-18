import {
    times,
    map,
    last,
    over,
    lensPath,
    init,
    view,
    pipe,
    omit,
    set,
    into,
    compose,
    chain,
    ifElse,
    identity
} from "ramda";

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
} from "../../utils/actions";

import { actionsLeft, incrementMetaCounter, passThroughPipeline, splitAlive, splitThrottled, isAlive, isThrottled, generateAnyNotSuspendSagaState } from "../../utils/utils";

import moment from 'moment'

describe('from sixth state', () => {

    describe(ANY_NON_QUEUEABLE_ACTION, () => {

        it('should go to sixth state', () => {

            times(
                () => {
                    const state = generateAnyNotSuspendSagaState()
                    const action = generateAction(ANY_NON_QUEUEABLE_ACTION)

                    const pipeline = passThroughPipeline(state, action)

                    expect(pipeline.store.getState()).toEqual(state)

                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const state = generateAnyNotSuspendSagaState()
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


                const state = generateAnyNotSuspendSagaState()
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
                    const state = generateAnyNotSuspendSagaState()
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

                const state = generateAnyNotSuspendSagaState()
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
                const state = generateAnyNotSuspendSagaState()
                const action = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE)

                const pipeline = passThroughPipeline(state, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(2)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action],
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
                    const state = generateAnyNotSuspendSagaState()
                    const queue = view(lensPath(['offline', 'queue']), state)

                    const action = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, queue)
                    if (queue.length > 0 && action) {
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
                const state = generateAnyNotSuspendSagaState()
                const queue = view(lensPath(['offline', 'queue']), state)
                const action = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, queue)

                if (queue.length > 0 && action) {
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
                const state = generateAnyNotSuspendSagaState()
                const queue = view(lensPath(['offline', 'queue']), state)
                const action = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, queue)

                if (queue.length > 0 && action) {
                    const pipeline = passThroughPipeline(state, action)

                    expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(2)
                    expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                        [action],
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
                    const state = generateAnyNotSuspendSagaState()

                    const action = generateAction(AUTO_ENQUEUE_TRUE)
                    const pipeline = passThroughPipeline(state, action)
                    const resultState = pipeline.store.getState()

                    const stateWithSagaSuspended = set(
                        lensPath(['offline', 'suspendSaga']),
                        true,
                        state
                    )

                    expect(resultState).toEqual(stateWithSagaSuspended)

                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const state = generateAnyNotSuspendSagaState()

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

                const state = generateAnyNotSuspendSagaState()

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
                    const state = generateAnyNotSuspendSagaState()

                    const action = generateAction(AUTO_ENQUEUE_FALSE)
                    const pipeline = passThroughPipeline(state, action)
                    const resultState = pipeline.store.getState()

                    expect(resultState).toEqual(state)

                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const state = generateAnyNotSuspendSagaState()

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

                const state = generateAnyNotSuspendSagaState()

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
                const state = generateAnyNotSuspendSagaState()

                const action = generateAction(RETRY_ALL)
                const queue = view(lensPath(['offline', 'queue']), state)

                if (queue.length > 0) {
                    const pipeline = passThroughPipeline(state, action)
                    const resultState = pipeline.store.getState()

                    const [throttled, retried] = splitThrottled(queue)
                    const [alive, dead] = splitAlive(retried)

                    const stateWithAliveElementsOnly = set(
                        lensPath(['offline', 'queue']),
                        [...throttled, ...alive],
                        state
                    )

                    const stateWithIncrementedActionsInQueue = over(
                        lensPath(['offline', 'queue']),
                        into(
                            [],
                            compose(
                                map(ifElse(isThrottled, identity, incrementMetaCounter)),
                                map(over(lensPath(['meta', 'queue']), omit(['throttle'])))
                            )
                        ),
                        stateWithAliveElementsOnly
                    )

                    const resultQueue = view(
                        lensPath(['offline', 'queue']),
                        resultState
                    )

                    const resultStateWithoutThrottle = over(
                        lensPath(['offline', 'queue']),
                        map(over(lensPath(['meta', 'queue']), omit(['throttle']))),
                        resultState
                    )

                    expect(resultStateWithoutThrottle).toEqual(stateWithIncrementedActionsInQueue)

                    resultQueue.forEach(element => {
                        expect(element).toHaveProperty('meta.queue.id')

                        expect(element).toHaveProperty('meta.queue.ttl')
                        expect(element).toHaveProperty('meta.queue.throttle')
                        expect(moment(element.meta.queue.ttl, moment.ISO_8601, true).isValid()).toBeTruthy()
                        expect(moment(element.meta.queue.throttle, moment.ISO_8601, true).isValid()).toBeTruthy()

                        if (element.meta.queue.times > 10) {
                            expect(moment(element.meta.queue.throttle).diff(moment(), 'minutes', true)).toBeGreaterThan(0)
                            expect(moment(element.meta.queue.throttle).diff(moment(), 'minutes', true)).toBeLessThanOrEqual(1)
                        } else {
                            expect(moment(element.meta.queue.throttle).diff(moment(), 'minutes', true)).toBeGreaterThan(1)
                        }
                    });

                } else {

                }
            },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const state = generateAnyNotSuspendSagaState()

                const action = generateAction(RETRY_ALL)
                const queue = view(lensPath(['offline', 'queue']), state)

                if (queue.length > 0) {
                    const pipeline = passThroughPipeline(state, action)

                    const [throttled, retried] = splitThrottled(queue)
                    const [alive, dead] = splitAlive(retried)

                    expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(1 + (retried.length * 3) + (alive.length))
                    expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                        [action],
                        ...chain(
                            x => {

                                const events = [
                                    [generateAction(RETRY_ACTION_IN_QUEUE, [x])],
                                    [generateAction(REMOVE_ACTION_IN_QUEUE, [x])],
                                    [generateAction(CONSUME_FIRST_FROM_QUEUE, [x])],
                                ]
                                if (isAlive(x)) {
                                    events.push([generateAction(ENQUEUE_ACTION_IN_QUEUE, [x])])
                                }

                                return events
                            }
                            ,
                            retried
                        )
                    ])

                } else {

                }
            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {

                const state = generateAnyNotSuspendSagaState()

                const action = generateAction(RETRY_ALL)
                const queue = view(lensPath(['offline', 'queue']), state)

                if (queue.length > 0) {
                    const pipeline = passThroughPipeline(state, action)

                    const [throttled, retried] = splitThrottled(queue)
                    const [alive, dead] = splitAlive(retried)

                    expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1 + (retried.length * 3) + (alive.length))
                    expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                        [action],
                        ...chain(
                            x => {

                                const events = [
                                    [generateAction(RETRY_ACTION_IN_QUEUE, [x])],
                                    [generateAction(REMOVE_ACTION_IN_QUEUE, [x])],
                                    [x],
                                ]
                                if (isAlive(x)) {
                                    events.push([generateAction(ENQUEUE_ACTION_IN_QUEUE, [x])])
                                }

                                return events
                            }
                            ,
                            retried
                        )
                    ])

                } else {

                }
            },
                100
            )

        })

    })

    describe(ENQUEUE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to fift state', () => {

            times(
                () => {
                    const state = generateAnyNotSuspendSagaState()

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

                const state = generateAnyNotSuspendSagaState()

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

                const state = generateAnyNotSuspendSagaState()

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
                    const state = generateAnyNotSuspendSagaState()
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

                const state = generateAnyNotSuspendSagaState()
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

                const state = generateAnyNotSuspendSagaState()
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
                    const state = generateAnyNotSuspendSagaState()
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

                const state = generateAnyNotSuspendSagaState()
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

                const state = generateAnyNotSuspendSagaState()
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
            const omitThrottleInAction = over(
                lensPath(['meta', 'queue']),
                omit(['throttle'])
            )
            times(
                () => {
                    const state = generateAnyNotSuspendSagaState()
                    const queue = view(lensPath(['offline', 'queue']), state)
                    if (queue.length > 0) {
                        const action = generateAction(RETRY_ACTION_IN_QUEUE, queue)
                        const pipeline = passThroughPipeline(state, action)
                        const resultState = pipeline.store.getState()

                        if (isAlive(action.payload)) {

                            const resultStateWithoutThrottle = over(
                                lensPath(['offline', 'queue', queue.length - 1]),
                                omitThrottleInAction,
                                resultState
                            )

                            const actionLefts = actionsLeft(queue, action)

                            const stateWithoutAction = set(
                                lensPath(['offline', 'queue']),
                                [...actionLefts, incrementMetaCounter(omitThrottleInAction(action.payload))],
                                state
                            )

                            expect(resultStateWithoutThrottle).toEqual(stateWithoutAction)

                        } else {

                            const actionLefts = actionsLeft(queue, action)
                            const stateWithoutAction = set(
                                lensPath(['offline', 'queue']),
                                actionLefts,
                                state
                            )

                            expect(resultState).toEqual(stateWithoutAction)

                        }
                    } else {
                        // impossible state
                    }

                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const state = generateAnyNotSuspendSagaState()
                const queue = view(lensPath(['offline', 'queue']), state)

                if (queue.length > 0) {

                    const action = generateAction(RETRY_ACTION_IN_QUEUE, queue)
                    const pipeline = passThroughPipeline(state, action)

                    if (isAlive(action.payload)) {

                        expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(4)
                        expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                            [action],
                            [generateAction(REMOVE_ACTION_IN_QUEUE, [action.payload])],
                            [generateAction(CONSUME_FIRST_FROM_QUEUE, [action.payload])],
                            [generateAction(ENQUEUE_ACTION_IN_QUEUE, [action.payload])],
                        ])

                    } else {

                        expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(3)
                        expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                            [action],
                            [generateAction(REMOVE_ACTION_IN_QUEUE, [action.payload])],
                            [generateAction(CONSUME_FIRST_FROM_QUEUE, [action.payload])],
                        ])

                    }

                } else {
                    // impossible state
                }
            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {

                const state = generateAnyNotSuspendSagaState()
                const queue = view(lensPath(['offline', 'queue']), state)

                if (queue.length > 0) {

                    const action = generateAction(RETRY_ACTION_IN_QUEUE, queue)
                    const pipeline = passThroughPipeline(state, action)

                    if (isAlive(action.payload)) {

                        expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(4)
                        expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                            [action],
                            [generateAction(REMOVE_ACTION_IN_QUEUE, [action.payload])],
                            [action.payload],
                            [generateAction(ENQUEUE_ACTION_IN_QUEUE, [action.payload])],
                        ])

                    } else {

                        expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(3)
                        expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                            [action],
                            [generateAction(REMOVE_ACTION_IN_QUEUE, [action.payload])],
                            [action.payload],
                        ])

                    }

                } else {
                    // impossible state
                }
            },
                100
            )

        })

    })

    describe(REMOVE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to sixth state', () => {

            times(
                () => {
                    const state = generateAnyNotSuspendSagaState()
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

                const state = generateAnyNotSuspendSagaState()
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

                const state = generateAnyNotSuspendSagaState()
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
                    const state = generateAnyNotSuspendSagaState()
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

                const state = generateAnyNotSuspendSagaState()
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

                const state = generateAnyNotSuspendSagaState()
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
