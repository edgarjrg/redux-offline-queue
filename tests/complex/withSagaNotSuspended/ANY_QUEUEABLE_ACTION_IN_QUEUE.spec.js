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

})
