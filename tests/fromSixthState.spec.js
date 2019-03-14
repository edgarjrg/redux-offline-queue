import { times, filter } from "ramda";

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

import { actionsLeft, incrementMetaCounter } from "./utils/utils";

describe('from sixth state', () => {

    const actionInQueue1 = generateAction(ACTION_IN_QUEUE)
    const actionInQueue2 = generateAction(ACTION_IN_QUEUE)

    const originalQueue = [actionInQueue1, actionInQueue2]
    const fifthState = {
        offline: {
            autoEnqueue: true,
            queue: originalQueue
        }
    }

    describe(ANY_NON_QUEUEABLE_ACTION, () => {

        it('should go to sixth state', () => {

            times(
                () => {
                    expect(fifthState)
                        .toSixthStateFromAction(
                            generateAction(ANY_NON_QUEUEABLE_ACTION),
                            actionInQueue1,
                            actionInQueue2
                        )
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

                    expect(fifthState)
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

    })

    describe(ANY_QUEUEABLE_ACTION_IN_QUEUE, () => {

        it('should go to sixth state', () => {

            times(
                () => {
                    const action = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, [actionInQueue1, actionInQueue2]);

                    expect(fifthState)
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

    })

    describe(AUTO_ENQUEUE_TRUE, () => {

        it('should go to sixth state', () => {

            times(
                () => {
                    const action = generateAction(AUTO_ENQUEUE_TRUE);

                    expect(fifthState)
                        .toSixthStateFromAction(
                            action,
                            actionInQueue1,
                            actionInQueue2,
                        )
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

                    expect(fifthState)
                        .toFiftStateFromAction(
                            action,
                            actionInQueue1,
                            actionInQueue2,
                        )
                },
                100
            )

        })

    })

    describe(RETRY_ALL, () => {

        it('should go to fift state', () => {

            times(() => {
                const action = generateAction(RETRY_ALL);

                expect(fifthState)
                    .toThirdStateFromAction(
                        action,
                    )
            })

        },
            100
        )

    })

    describe(ENQUEUE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to fift state', () => {

            times(
                () => {
                    const action = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE);

                    expect(fifthState)
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

    })

    describe(ENQUEUE_ACTION_IN_QUEUE, () => {

        it('should go to fift state', () => {

            times(
                () => {
                    const action = generateAction(ENQUEUE_ACTION_IN_QUEUE, [actionInQueue1, actionInQueue2]);

                    expect(fifthState)
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

    })

    describe(RETRY_ACTION_NOT_IN_QUEUE, () => {

        it('should go to fift state', () => {

            times(
                () => {
                    const action = generateAction(RETRY_ACTION_NOT_IN_QUEUE);

                    expect(fifthState)
                        .toSixthStateFromAction(
                            action,
                            actionInQueue1,
                            actionInQueue2,
                        )
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

                    expect(fifthState)
                        .toSixthStateFromAction(
                            actionToRetry,
                            ...left,
                            incrementMetaCounter(actionToRetry.payload)
                        )
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

                    expect(fifthState)
                        .toSixthStateFromAction(
                            action,
                            actionInQueue1,
                            actionInQueue2
                        )
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

                    expect(fifthState)
                        .toSixthStateFromAction(
                            actionToRemove,
                            ...actionLefts
                        )
                },
                100
            )

        })

    })

})
