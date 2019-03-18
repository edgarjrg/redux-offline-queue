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

})
