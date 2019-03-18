import { times } from "ramda";

import {
    ANY_NON_QUEUEABLE_ACTION,
    ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE,
    ANY_QUEUEABLE_ACTION_IN_QUEUE,
    AUTO_ENQUEUE_TRUE,
    AUTO_ENQUEUE_FALSE,
    ENQUEUE_ACTION_NOT_IN_QUEUE,
    ENQUEUE_ACTION_IN_QUEUE,
    REMOVE_ACTION_NOT_IN_QUEUE,
    REMOVE_ACTION_IN_QUEUE,
    RETRY_ACTION_NOT_IN_QUEUE,
    RETRY_ACTION_IN_QUEUE,
    RETRY_ALL,
    ACTION_IN_QUEUE,
    CONSUME_FIRST_FROM_QUEUE,
    generateAction
} from "./utils/actions";
import { incrementMetaCounter, passThroughPipeline } from "./utils/utils";

describe('from second state', () => {

    const actionInQueue1 = generateAction(ACTION_IN_QUEUE)
    const originalQueue = [actionInQueue1]
    const secondState = {
        offline: {
            suspendSaga: true,
            queue: originalQueue
        }
    }

    describe(ANY_NON_QUEUEABLE_ACTION, () => {

        it('should go to second state', () => {

            times(
                () => {
                    expect(secondState)
                        .toSecondStateFromAction(
                            generateAction(ANY_NON_QUEUEABLE_ACTION),
                            actionInQueue1
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(ANY_NON_QUEUEABLE_ACTION)
                const pipeline = passThroughPipeline(secondState, action)

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
                const action = generateAction(ANY_NON_QUEUEABLE_ACTION)
                const pipeline = passThroughPipeline(secondState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action]
                ])

            },
                100
            )

        })

    })

    describe(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to fifth state', () => {

            const action = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE)

            times(
                () => {
                    expect(secondState)
                        .toFiftStateFromCreationAction(
                            action,
                            actionInQueue1,
                            incrementMetaCounter(action)
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE)
                const pipeline = passThroughPipeline(secondState, action)

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(2)
                expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                    [action],
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, [action])]
                ])

            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {
                const action = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE)
                const pipeline = passThroughPipeline(secondState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, [action])]
                ])

            },
                100
            )

        })
    })

    describe(ANY_QUEUEABLE_ACTION_IN_QUEUE, () => {

        it('should go to second state', () => {

            times(
                () => {
                    expect(secondState)
                        .toFiftStateFromCreationAction(
                            generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, originalQueue),
                            actionInQueue1,
                            incrementMetaCounter(actionInQueue1)
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(secondState, action)

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(2)
                expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                    [generateAction(CONSUME_FIRST_FROM_QUEUE, [action])],
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, [action])],
                ])

            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {
                const action = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(secondState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, [action])]
                ])

            },
                100
            )

        })

    })

    describe(AUTO_ENQUEUE_TRUE, () => {

        it('should go to second state', () => {

            times(
                () => {
                    expect(secondState)
                        .toSecondStateFromAction(
                            generateAction(AUTO_ENQUEUE_TRUE),
                            actionInQueue1
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(AUTO_ENQUEUE_TRUE)
                const pipeline = passThroughPipeline(secondState, action)

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
                const action = generateAction(AUTO_ENQUEUE_TRUE)
                const pipeline = passThroughPipeline(secondState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action]
                ])

            },
                100
            )

        })

    })

    describe(AUTO_ENQUEUE_FALSE, () => {

        it('should go to fourth state', () => {
            times(
                () => {
                    expect(secondState)
                        .toFourthStateFromAction(
                            generateAction(AUTO_ENQUEUE_FALSE),
                            actionInQueue1
                        )
                },
                100
            )
        })


        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(AUTO_ENQUEUE_FALSE)
                const pipeline = passThroughPipeline(secondState, action)

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
                const action = generateAction(AUTO_ENQUEUE_FALSE)
                const pipeline = passThroughPipeline(secondState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action]
                ])

            },
                100
            )

        })

    })

    describe(ENQUEUE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to first state', () => {

            times(
                () => {
                    const secondAction = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE)
                    expect(secondState)
                        .toFiftStateFromCreationAction(
                            secondAction,
                            actionInQueue1,
                            incrementMetaCounter(secondAction.payload)
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(secondState, action)

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
                const action = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(secondState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action]
                ])

            },
                100
            )

        })

    })

    describe(ENQUEUE_ACTION_IN_QUEUE, () => {

        it('should go to fifth state', () => {

            times(
                () => {
                    const secondAction = generateAction(ENQUEUE_ACTION_IN_QUEUE, [actionInQueue1])
                    expect(secondState)
                        .toFiftStateFromAction(
                            secondAction,
                            actionInQueue1,
                            incrementMetaCounter(secondAction.payload)
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(ENQUEUE_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(secondState, action)

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
                const action = generateAction(ENQUEUE_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(secondState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action]
                ])

            },
                100
            )

        })

    })

    describe(REMOVE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to second state', () => {

            times(
                () => {
                    const secondAction = generateAction(REMOVE_ACTION_NOT_IN_QUEUE, [actionInQueue1])
                    expect(secondState)
                        .toSecondStateFromAction(
                            secondAction,
                            actionInQueue1
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(REMOVE_ACTION_NOT_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(secondState, action)

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
                const action = generateAction(REMOVE_ACTION_NOT_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(secondState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action]
                ])

            },
                100
            )

        })

    })

    describe(REMOVE_ACTION_IN_QUEUE, () => {

        it('should go to first state', () => {

            times(
                () => {

                    const secondAction = generateAction(REMOVE_ACTION_IN_QUEUE, [actionInQueue1])

                    expect(secondState)
                        .toFirstStateFromAction(
                            secondAction,
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(REMOVE_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(secondState, action)

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
                const action = generateAction(REMOVE_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(secondState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action]
                ])

            },
                100
            )

        })

    })

    describe(RETRY_ACTION_NOT_IN_QUEUE, () => {

        it('should go to fifth state', () => {
            times(
                () => {
                    const secondAction = generateAction(RETRY_ACTION_NOT_IN_QUEUE, [actionInQueue1])
                    expect(secondState)
                        .toSecondStateFromAction(
                            secondAction,
                            actionInQueue1
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(RETRY_ACTION_NOT_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(secondState, action)

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
                const action = generateAction(RETRY_ACTION_NOT_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(secondState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action]
                ])

            },
                100
            )

        })

    })

    describe(RETRY_ACTION_IN_QUEUE, () => {

        it('should go to fifth state', () => {

            times(
                () => {
                    const secondAction = generateAction(RETRY_ACTION_IN_QUEUE, [actionInQueue1])
                    expect(secondState)
                        .toSecondStateFromAction(
                            secondAction,
                            actionInQueue1
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(RETRY_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(secondState, action)

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
                const action = generateAction(RETRY_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(secondState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action]
                ])

            },
                100
            )

        })

    })

    describe(RETRY_ALL, () => {

        it('should go to fifth state', () => {

            times(
                () => {

                    const secondAction = generateAction(RETRY_ALL, [actionInQueue1])

                    expect(secondState)
                        .toSecondStateFromAction(
                            secondAction,
                            actionInQueue1
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(RETRY_ALL, originalQueue)
                const pipeline = passThroughPipeline(secondState, action)

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
                const action = generateAction(RETRY_ALL, originalQueue)
                const pipeline = passThroughPipeline(secondState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action]
                ])

            },
                100
            )

        })

    })

})

