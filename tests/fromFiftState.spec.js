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
import { actionsLeft, incrementMetaCounter } from "./utils/utils";

describe('from fift state', () => {

    const actionInQueue1 = generateAction(ACTION_IN_QUEUE)
    const actionInQueue2 = generateAction(ACTION_IN_QUEUE)

    const originalQueue = [actionInQueue1, actionInQueue2]
    const fifthState = {
        offline: {
            autoEnqueue: false,
            queue: originalQueue
        }
    }

    describe(ANY_NON_QUEUEABLE_ACTION, () => {

        it('should go to fifth state', () => {

            times(
                () => {
                    expect(fifthState)
                        .toFiftStateFromAction(
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

        it('should go to fifth state', () => {
            times(
                () => {
                    const action = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE)

                    expect(fifthState)
                        .toFiftStateFromCreationAction(
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

        it('should go to fift state', () => {

            times(
                () => {
                    const action = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, [actionInQueue1, actionInQueue2])

                    expect(fifthState)
                        .toFiftStateFromAction(
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
                    expect(fifthState)
                        .toSixthStateFromAction(
                            generateAction(AUTO_ENQUEUE_TRUE),
                            actionInQueue1,
                            actionInQueue2
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
                    expect(fifthState)
                        .toFiftStateFromAction(
                            generateAction(AUTO_ENQUEUE_FALSE),
                            actionInQueue1,
                            actionInQueue2
                        )
                },
                100
            )

        })

    })

    describe(RETRY_ALL, () => {

        it('should go to first state', () => {

            times(
                () => {
                    expect(fifthState)
                        .toFirstStateFromAction(
                            generateAction(RETRY_ALL)
                        )
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

                    expect(fifthState)
                        .toFiftStateFromCreationAction(
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
                        .toFiftStateFromCreationAction(
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
                        .toFiftStateFromAction(
                            action,
                            actionInQueue1,
                            actionInQueue2
                        )
                },
                100
            )

        })

    })

    describe(RETRY_ACTION_IN_QUEUE, () => {

        it('should go to fift state', () => {

            times(
                () => {

                    const actionToRetry = generateAction(RETRY_ACTION_IN_QUEUE, originalQueue);

                    const lefts = actionsLeft(
                        originalQueue,
                        actionToRetry
                    )

                    const expectedQueue = [...lefts, incrementMetaCounter(actionToRetry.payload)]

                    expect(fifthState)
                        .toFiftStateFromAction(
                            actionToRetry,
                            ...expectedQueue
                        )
                },
                100
            )

        })

    })

    describe(REMOVE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to fift state', () => {

            times(
                () => {
                    const action = generateAction(REMOVE_ACTION_NOT_IN_QUEUE);

                    expect(fifthState)
                        .toFiftStateFromAction(
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
                    const action = generateAction(REMOVE_ACTION_IN_QUEUE, originalQueue);

                    const actionLefts = actionsLeft(originalQueue, action)
                    expect(fifthState)
                        .toFiftStateFromAction(
                            action,
                            ...actionLefts
                        )
                },
                100
            )

        })

    })

})
