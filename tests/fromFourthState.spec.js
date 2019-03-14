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
import { incrementMetaCounter } from "./utils/utils";

describe('state: {autoEnqueue: true, queue: [a]}}', () => {

    const actionInQueue = generateAction(ACTION_IN_QUEUE)

    const fourthState = {
        offline: {
            autoEnqueue: true,
            queue: [actionInQueue]
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

    })

    describe(ANY_QUEUEABLE_ACTION_IN_QUEUE, () => {

        it('should go to sixth state', () => {

            const secondAction = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, [actionInQueue])

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

    })

    describe(AUTO_ENQUEUE_TRUE, () => {

        it('should go to fourth state', () => {

            const secondAction = generateAction(AUTO_ENQUEUE_TRUE)

            times(
                () => {
                    expect(fourthState)
                        .toFourthStateFromAction(
                            secondAction,
                            actionInQueue,
                        )
                },
                100
            )

        })

    })

    describe(AUTO_ENQUEUE_FALSE, () => {

        it('should go to second state', () => {

            const action = generateAction(AUTO_ENQUEUE_FALSE)

            times(
                () => {
                    expect(fourthState)
                        .toSecondStateFromAction(
                            action,
                            actionInQueue,
                        )
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
                        .toThirdStateFromAction(
                            action,
                        )
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

    })

    describe(ENQUEUE_ACTION_IN_QUEUE, () => {

        it('should go to fourth state', () => {

            const action = generateAction(ENQUEUE_ACTION_IN_QUEUE, [actionInQueue])

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

    })

    describe(RETRY_ACTION_NOT_IN_QUEUE, () => {

        it('should go to fourth state', () => {

            const action = generateAction(RETRY_ACTION_NOT_IN_QUEUE, [actionInQueue])

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

    })

    describe(RETRY_ACTION_IN_QUEUE, () => {

        it('should go to fourth state', () => {

            const action = generateAction(RETRY_ACTION_IN_QUEUE, [actionInQueue])

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

    })

    describe(REMOVE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to fourth state', () => {

            const action = generateAction(REMOVE_ACTION_NOT_IN_QUEUE, [actionInQueue])

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

    })

    describe(REMOVE_ACTION_IN_QUEUE, () => {

        it('should go to fourth state', () => {

            const action = generateAction(REMOVE_ACTION_IN_QUEUE, [actionInQueue])

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

    })

    describe(REMOVE_ACTION_IN_QUEUE, () => {

        it('should go to fourth state', () => {

            const action = generateAction(REMOVE_ACTION_IN_QUEUE, [actionInQueue])

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

    })

})

