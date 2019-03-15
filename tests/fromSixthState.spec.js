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

import { actionsLeft, incrementMetaCounter, passThroughPipeline } from "./utils/utils";

describe('from sixth state', () => {

    const actionInQueue1 = generateAction(ACTION_IN_QUEUE)
    const actionInQueue2 = generateAction(ACTION_IN_QUEUE)

    const originalQueue = [actionInQueue1, actionInQueue2]
    const sixthState = {
        offline: {
            autoEnqueue: true,
            queue: originalQueue
        }
    }

    describe(ANY_NON_QUEUEABLE_ACTION, () => {

        it('should go to sixth state', () => {

            times(
                () => {
                    expect(sixthState)
                        .toSixthStateFromAction(
                            generateAction(ANY_NON_QUEUEABLE_ACTION),
                            actionInQueue1,
                            actionInQueue2
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const action = generateAction(ANY_NON_QUEUEABLE_ACTION, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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

                const action = generateAction(ANY_NON_QUEUEABLE_ACTION, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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
                    const action = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE);

                    expect(sixthState)
                        .toSixthStateFromCreationAction(
                            action,
                            actionInQueue1,
                            actionInQueue2,
                            incrementMetaCounter(action)
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const action = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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

                const action = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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
                    const action = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, [actionInQueue1, actionInQueue2]);

                    expect(sixthState)
                        .toSixthStateFromAction(
                            action,
                            actionInQueue1,
                            actionInQueue2,
                            incrementMetaCounter(action)
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const action = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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
                const pipeline = passThroughPipeline(sixthState, action)

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

    describe(AUTO_ENQUEUE_TRUE, () => {

        it('should go to sixth state', () => {

            times(
                () => {
                    const action = generateAction(AUTO_ENQUEUE_TRUE);

                    expect(sixthState)
                        .toSixthStateFromAction(
                            action,
                            actionInQueue1,
                            actionInQueue2,
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const action = generateAction(AUTO_ENQUEUE_TRUE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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

                const action = generateAction(AUTO_ENQUEUE_TRUE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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

        it('should go to fift state', () => {

            times(
                () => {
                    const action = generateAction(AUTO_ENQUEUE_FALSE);

                    expect(sixthState)
                        .toFiftStateFromAction(
                            action,
                            actionInQueue1,
                            actionInQueue2,
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const action = generateAction(AUTO_ENQUEUE_FALSE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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

                const action = generateAction(AUTO_ENQUEUE_FALSE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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
                const action = generateAction(RETRY_ALL);

                expect(sixthState)
                    .toSixthStateFromAction(
                        action,
                        ...[
                            incrementMetaCounter(actionInQueue1),
                            incrementMetaCounter(actionInQueue2)
                        ]
                    )
            },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const action = generateAction(RETRY_ALL, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(9)
                expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                    [action],
                    [generateAction(RETRY_ACTION_IN_QUEUE, [actionInQueue1])],
                    [generateAction(REMOVE_ACTION_IN_QUEUE, [actionInQueue1])],
                    [generateAction(CONSUME_FIRST_FROM_QUEUE, [actionInQueue1])],
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, [actionInQueue1])],
                    [generateAction(RETRY_ACTION_IN_QUEUE, [actionInQueue2])],
                    [generateAction(REMOVE_ACTION_IN_QUEUE, [actionInQueue2])],
                    [generateAction(CONSUME_FIRST_FROM_QUEUE, [actionInQueue2])],
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, [actionInQueue2])],
                ])
            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {

                const action = generateAction(RETRY_ALL, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(9)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action],
                    [generateAction(RETRY_ACTION_IN_QUEUE, [actionInQueue1])],
                    [generateAction(REMOVE_ACTION_IN_QUEUE, [actionInQueue1])],
                    [actionInQueue1],
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, [actionInQueue1])],
                    [generateAction(RETRY_ACTION_IN_QUEUE, [actionInQueue2])],
                    [generateAction(REMOVE_ACTION_IN_QUEUE, [actionInQueue2])],
                    [actionInQueue2],
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, [actionInQueue2])],
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
                    const action = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE);

                    expect(sixthState)
                        .toSixthStateFromCreationAction(
                            action,
                            actionInQueue1,
                            actionInQueue2,
                            incrementMetaCounter(action.payload)
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const action = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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

                const action = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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
                    const action = generateAction(ENQUEUE_ACTION_IN_QUEUE, [actionInQueue1, actionInQueue2]);

                    expect(sixthState)
                        .toSixthStateFromAction(
                            action,
                            actionInQueue1,
                            actionInQueue2,
                            incrementMetaCounter(action.payload)
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const action = generateAction(ENQUEUE_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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

                const action = generateAction(ENQUEUE_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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

        it('should go to fift state', () => {

            times(
                () => {
                    const action = generateAction(RETRY_ACTION_NOT_IN_QUEUE);

                    expect(sixthState)
                        .toSixthStateFromAction(
                            action,
                            actionInQueue1,
                            actionInQueue2,
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const action = generateAction(RETRY_ACTION_NOT_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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

                const action = generateAction(RETRY_ACTION_NOT_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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
                    const actionToRetry = generateAction(RETRY_ACTION_IN_QUEUE, originalQueue);

                    const left = actionsLeft(originalQueue, actionToRetry)

                    expect(sixthState)
                        .toSixthStateFromAction(
                            actionToRetry,
                            ...left,
                            incrementMetaCounter(actionToRetry.payload)
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const action = generateAction(RETRY_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(4)
                expect(pipeline.gotToReducerSpy.mock.calls).toEqual([
                    [action],
                    [generateAction(REMOVE_ACTION_IN_QUEUE, [action.payload])],
                    [generateAction(CONSUME_FIRST_FROM_QUEUE, [action.payload])],
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, [action.payload])],
                ])
            },
                100
            )

        })

        it('action should reach saga', () => {
            times(() => {

                const action = generateAction(RETRY_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(4)
                expect(pipeline.sagaMiddlewareSpy.mock.calls).toEqual([
                    [action],
                    [generateAction(REMOVE_ACTION_IN_QUEUE, [action.payload])],
                    [action.payload],
                    [generateAction(ENQUEUE_ACTION_IN_QUEUE, [action.payload])],
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
                    const action = generateAction(REMOVE_ACTION_NOT_IN_QUEUE);

                    expect(sixthState)
                        .toSixthStateFromAction(
                            action,
                            actionInQueue1,
                            actionInQueue2
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const action = generateAction(REMOVE_ACTION_NOT_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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

                const action = generateAction(REMOVE_ACTION_NOT_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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
                    const actionToRemove = generateAction(REMOVE_ACTION_IN_QUEUE, originalQueue);

                    const actionLefts = actionsLeft(originalQueue, actionToRemove)

                    expect(sixthState)
                        .toSixthStateFromAction(
                            actionToRemove,
                            ...actionLefts
                        )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {

                const action = generateAction(REMOVE_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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

                const action = generateAction(REMOVE_ACTION_IN_QUEUE, originalQueue)
                const pipeline = passThroughPipeline(sixthState, action)

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
