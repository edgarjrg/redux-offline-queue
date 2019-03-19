import {
    times,
    range,
    map,
    last,
    over,
    lensPath,
    init,
    view,
    pipe,
    omit,
    set
} from "ramda";

import {
    ANY_NON_QUEUEABLE_ACTION,
    ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE,
    ANY_QUEUEABLE_ACTION_IN_QUEUE,
    SUSPEND_SAGA_TRUE,
    SUSPEND_SAGA_FALSE,
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

import { actionsLeft, incrementMetaCounter, passThroughPipeline, isAlive, generateAnySuspendSagaState } from "../../utils/utils";
import faker from 'faker'
import uuid from 'uuid/v1'
import moment from 'moment'

describe('from sixth state', () => {

    describe(ANY_QUEUEABLE_ACTION_IN_QUEUE, () => {

        it('should go to sixth state', () => {

            times(
                () => {
                    const state = generateAnySuspendSagaState()
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
                const state = generateAnySuspendSagaState()
                const queue = view(lensPath(['offline', 'queue']), state)

                const action = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, queue)
                if (queue.length > 0 && action) {
                    const pipeline = passThroughPipeline(state, action)

                    if (isAlive(action)) {
                        expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(2)
                        expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                            [generateAction(CONSUME_FIRST_FROM_QUEUE, [action])],
                            [generateAction(ENQUEUE_ACTION_IN_QUEUE, [action])],
                        ])
                    } else {
                        expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(1)
                        expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                            [generateAction(CONSUME_FIRST_FROM_QUEUE, [action])],
                        ])
                    }
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
                const action = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, queue)

                if (queue.length > 0 && action) {
                    const pipeline = passThroughPipeline(state, action)

                    if (isAlive(action)) {

                        expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                        expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                            [generateAction(ENQUEUE_ACTION_IN_QUEUE, [action])],
                        ])

                    } else {

                        expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(0)
                        expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                        ])

                    }
                } else {
                    // impossible state if no actions are queued
                }

            },
                100
            )

        })

    })

})
