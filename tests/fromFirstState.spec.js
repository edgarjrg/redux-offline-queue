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
} from "./utils/actions";

import { incrementMetaCounter, passThroughPipeline } from "./utils/utils";

describe('from first state', () => {
    const firstState = {
        offline: {
            autoEnqueue: false,
            queue: []
        }
    }

    describe(ANY_NON_QUEUEABLE_ACTION, () => {

        it('should go to first state', () => {

            times(() => {
                expect(firstState)
                    .toFirstStateFromAction(
                        generateAction(ANY_NON_QUEUEABLE_ACTION)
                    )
            },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(ANY_NON_QUEUEABLE_ACTION)
                const pipeline = passThroughPipeline(firstState, action)

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
                const pipeline = passThroughPipeline(firstState, action)

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

        it('should go to first state', () => {

            const action = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE)

            times(() => {
                expect({
                    offline: {
                        autoEnqueue: false,
                        queue: []
                    }
                }).toSecondStateFromCreationAction(
                    action,
                    incrementMetaCounter(action)
                )
            },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE)
                const pipeline = passThroughPipeline(firstState, action)

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
                const pipeline = passThroughPipeline(firstState, action)

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
        it('should be impossible', () => { })
    })

    describe(AUTO_ENQUEUE_TRUE, () => {

        it('should go to third state', () => {

            times(() => {
                expect({
                    offline: {
                        autoEnqueue: false,
                        queue: []
                    }
                }).toThirdStateFromAction(
                    generateAction(AUTO_ENQUEUE_TRUE)
                )
            },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(AUTO_ENQUEUE_TRUE)
                const pipeline = passThroughPipeline(firstState, action)

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
                const pipeline = passThroughPipeline(firstState, action)

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

        it('should go to first state', () => {

            times(() => {
                expect(firstState)
                    .toFirstStateFromAction(
                        generateAction(AUTO_ENQUEUE_FALSE)
                    )
            },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(AUTO_ENQUEUE_FALSE)
                const pipeline = passThroughPipeline(firstState, action)

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
                const pipeline = passThroughPipeline(firstState, action)

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

        it('should go to first state', () => {

            times(() => {
                expect(firstState)
                    .toFirstStateFromAction(
                        generateAction(RETRY_ALL)
                    )
            },
                100
            )


        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(RETRY_ALL)
                const pipeline = passThroughPipeline(firstState, action)

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
                const action = generateAction(RETRY_ALL)
                const pipeline = passThroughPipeline(firstState, action)

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

        it('should go to second state', () => {

            times(
                () => {
                    const action = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE);

                    expect({
                        offline: {
                            autoEnqueue: false,
                            queue: []
                        }
                    }).toSecondStateFromCreationAction(
                        action,
                        incrementMetaCounter(action.payload)
                    )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE)
                const pipeline = passThroughPipeline(firstState, action)

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
                const pipeline = passThroughPipeline(firstState, action)

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

        it('should be impossible', () => { })

    })

    describe(RETRY_ACTION_NOT_IN_QUEUE, () => {

        it('should go to first state', () => {

            times(
                () => {
                    expect({
                        offline: {
                            autoEnqueue: false,
                            queue: []
                        }
                    }).toFirstStateFromAction(
                        generateAction(RETRY_ACTION_NOT_IN_QUEUE)
                    )
                },
                100
            )
        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(RETRY_ACTION_NOT_IN_QUEUE)
                const pipeline = passThroughPipeline(firstState, action)

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
                const action = generateAction(RETRY_ACTION_NOT_IN_QUEUE)
                const pipeline = passThroughPipeline(firstState, action)

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

        it('should be impossible', () => { })

    })

    describe(REMOVE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to first state', () => {
            times(
                () => {
                    expect({
                        offline: {
                            autoEnqueue: false,
                            queue: []
                        }
                    }).toFirstStateFromAction(
                        generateAction(REMOVE_ACTION_NOT_IN_QUEUE)
                    )
                },
                100
            )

        })

        it('action should reach reducer', () => {
            times(() => {
                const action = generateAction(REMOVE_ACTION_NOT_IN_QUEUE)
                const pipeline = passThroughPipeline(firstState, action)

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
                const action = generateAction(REMOVE_ACTION_NOT_IN_QUEUE)
                const pipeline = passThroughPipeline(firstState, action)

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

        it('should be impossible', () => { })

    })

})

