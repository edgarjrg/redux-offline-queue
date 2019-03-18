import { times } from "ramda";

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
import { incrementMetaCounter, passThroughPipeline } from "./utils/utils";

describe('from fourth state', () => {

    const actionInQueue = generateAction(ACTION_IN_QUEUE)

    const originalQueue = [actionInQueue]

    const fourthState = {
        offline: {
            suspendSaga: false,
            queue: originalQueue
        }
    }

    describe(ANY_NON_QUEUEABLE_ACTION, () => {

        it('should go to fourth state', () => {

            times(
                () => {
                    expect(fourthState)
                        .toFourthStateFromCreationAction(
                            generateAction(ANY_NON_QUEUEABLE_ACTION),
                            actionInQueue
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(ANY_NON_QUEUEABLE_ACTION)
                const pipeline = passThroughPipeline(fourthState, action)

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
                const pipeline = passThroughPipeline(fourthState, action)

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

        it('should go to sixth state', () => {

            const secondAction = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE)

            times(
                () => {
                    expect(fourthState)
                        .toSixthStateFromCreationAction(
                            secondAction,
                            actionInQueue,
                            incrementMetaCounter(secondAction)
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE)
                const pipeline = passThroughPipeline(fourthState, action)

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
                const pipeline = passThroughPipeline(fourthState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(2)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action],
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, [action])]
                ])

            },
                100
            )

        })

    })

    describe(ANY_QUEUEABLE_ACTION_IN_QUEUE, () => {

        it('should go to sixth state', () => {

            const secondAction = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, originalQueue)

            times(
                () => {
                    expect(fourthState)
                        .toSixthStateFromAction(
                            secondAction,
                            actionInQueue,
                            incrementMetaCounter(secondAction)
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(fourthState, action)

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
                const pipeline = passThroughPipeline(fourthState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(2)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action],
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, [action])]
                ])

            },
                100
            )

        })

    })

    describe(AUTO_ENQUEUE_TRUE, () => {

        it('should go to second state', () => {

            const secondAction = generateAction(AUTO_ENQUEUE_TRUE)

            times(
                () => {
                    expect(fourthState)
                        .toSecondStateFromAction(
                            secondAction,
                            actionInQueue,
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(AUTO_ENQUEUE_TRUE)
                const pipeline = passThroughPipeline(fourthState, action)

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
                const pipeline = passThroughPipeline(fourthState, action)

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

            const action = generateAction(AUTO_ENQUEUE_FALSE)

            times(
                () => {
                    expect(fourthState)
                        .toFourthStateFromAction(
                            action,
                            actionInQueue,
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(AUTO_ENQUEUE_FALSE)
                const pipeline = passThroughPipeline(fourthState, action)

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
                const pipeline = passThroughPipeline(fourthState, action)

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

        it('should go to third state', () => {
            const action = generateAction(RETRY_ALL)

            times(
                () => {
                    expect(fourthState)
                        .toFourthStateFromAction(
                            action,
                            incrementMetaCounter(actionInQueue)
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(RETRY_ALL)
                const pipeline = passThroughPipeline(fourthState, action)

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(5)
                expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                    [action],
                    [generateAction(RETRY_ACTION_IN_QUEUE, originalQueue)],
                    [generateAction(REMOVE_ACTION_IN_QUEUE, originalQueue)],
                    [generateAction(CONSUME_FIRST_FROM_QUEUE, originalQueue)],
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, originalQueue)],
                ])

            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {
                const action = generateAction(RETRY_ALL)
                const pipeline = passThroughPipeline(fourthState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(5)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action],
                    [generateAction(RETRY_ACTION_IN_QUEUE, originalQueue)],
                    [generateAction(REMOVE_ACTION_IN_QUEUE, originalQueue)],
                    [actionInQueue],
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, originalQueue)]
                ])

            },
                100
            )

        })

    })

    describe(ENQUEUE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to sixth state', () => {

            const action = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE)

            times(
                () => {
                    expect(fourthState)
                        .toSixthStateFromCreationAction(
                            action,
                            actionInQueue,
                            incrementMetaCounter(action.payload)
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE)
                const pipeline = passThroughPipeline(fourthState, action)

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
                const action = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE)
                const pipeline = passThroughPipeline(fourthState, action)

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

        it('should go to fourth state', () => {

            const action = generateAction(ENQUEUE_ACTION_IN_QUEUE, originalQueue)

            times(
                () => {
                    expect(fourthState)
                        .toSixthStateFromAction(
                            action,
                            actionInQueue,
                            incrementMetaCounter(action.payload)
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const action = generateAction(ENQUEUE_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(fourthState, action)

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

                const pipeline = passThroughPipeline(fourthState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action],
                ])

            },
                100
            )

        })

    })

    describe(RETRY_ACTION_NOT_IN_QUEUE, () => {

        it('should go to fourth state', () => {

            const action = generateAction(RETRY_ACTION_NOT_IN_QUEUE, originalQueue)

            times(
                () => {
                    expect(fourthState)
                        .toFourthStateFromAction(
                            action,
                            actionInQueue,
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const action = generateAction(RETRY_ACTION_NOT_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(fourthState, action)

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

                const pipeline = passThroughPipeline(fourthState, action)

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

        it('should go to fourth state', () => {

            const action = generateAction(RETRY_ACTION_IN_QUEUE, originalQueue)

            times(
                () => {
                    expect(fourthState)
                        .toFourthStateFromAction(
                            action,
                            incrementMetaCounter(actionInQueue)
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const action = generateAction(RETRY_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(fourthState, action)

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(4)
                expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                    [action],
                    [generateAction(REMOVE_ACTION_IN_QUEUE, originalQueue)],
                    [generateAction(CONSUME_FIRST_FROM_QUEUE, originalQueue)],
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, originalQueue)]
                ])
            },
                1
            )

        })

        it('action should reach saga', () => {
            times(() => {

                const action = generateAction(RETRY_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(fourthState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(4)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action],
                    [generateAction(REMOVE_ACTION_IN_QUEUE, originalQueue)],
                    [actionInQueue],
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, originalQueue)]
                ])
            },
                100
            )

        })

    })

    describe(REMOVE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to fourth state', () => {

            const action = generateAction(REMOVE_ACTION_NOT_IN_QUEUE, originalQueue)

            times(
                () => {
                    expect(fourthState)
                        .toFourthStateFromAction(
                            action,
                            actionInQueue,
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const action = generateAction(REMOVE_ACTION_NOT_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(fourthState, action)

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                    [action]
                ])
            },
                1
            )

        })

        it('action should reach saga', () => {
            times(() => {

                const action = generateAction(REMOVE_ACTION_NOT_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(fourthState, action)

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

        it('should go to fourth state', () => {

            const action = generateAction(REMOVE_ACTION_IN_QUEUE, originalQueue)

            times(
                () => {
                    expect(fourthState)
                        .toThirdStateFromAction(
                            action,
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const action = generateAction(REMOVE_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(fourthState, action)

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                    [action],
                ])
            },
                1
            )

        })

        it('action should reach saga', () => {
            times(() => {

                const action = generateAction(REMOVE_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(fourthState, action)

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

