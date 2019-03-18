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

import { actionsLeft, incrementMetaCounter, passThroughPipeline, isAlive, generateAnySuspendSagaState } from "../../utils/utils";
import faker from 'faker'
import uuid from 'uuid/v1'
import moment from 'moment'

describe('from sixth state', () => {

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

})
