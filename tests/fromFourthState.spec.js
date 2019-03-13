import { times } from "lodash";

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

            times(100, () => {
                expect(fourthState)
                    .toFourthStateFromAction(
                        generateAction(ANY_NON_QUEUEABLE_ACTION),
                        actionInQueue
                    )
            })

        })

    })

    describe(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to sixth state', () => {

            const secondAction = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE)

            times(100, () => {
                expect(fourthState)
                    .toSixthStateFromAction(
                        secondAction,
                        actionInQueue,
                        secondAction
                    )
            })

        })

    })

    describe(ANY_QUEUEABLE_ACTION_IN_QUEUE, () => {

        it('should go to sixth state', () => {

            const secondAction = generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, [actionInQueue])

            times(100, () => {
                expect(fourthState)
                    .toSixthStateFromAction(
                        secondAction,
                        actionInQueue,
                        secondAction
                    )
            })

        })

    })

    describe(AUTO_ENQUEUE_TRUE, () => {

        it('should go to fourth state', () => {

            const secondAction = generateAction(AUTO_ENQUEUE_TRUE)

            times(100, () => {
                expect(fourthState)
                    .toFourthStateFromAction(
                        secondAction,
                        actionInQueue,
                    )
            })

        })

    })

    describe(AUTO_ENQUEUE_FALSE, () => {

        it('should go to second state', () => {

            const action = generateAction(AUTO_ENQUEUE_FALSE)

            times(100, () => {
                expect(fourthState)
                    .toSecondStateFromAction(
                        action,
                        actionInQueue,
                    )
            })

        })

    })

    describe(RETRY_ALL, () => {

        it('should go to third state', () => {

            const action = generateAction(RETRY_ALL)

            times(100, () => {
                expect(fourthState)
                    .toThirdStateFromAction(
                        action,
                    )
            })

        })

    })

    describe(ENQUEUE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to sixth state', () => {

            const action = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE)

            times(100, () => {
                expect(fourthState)
                    .toSixthStateFromAction(
                        action,
                        actionInQueue,
                        action.payload
                    )
            })

        })

    })

    describe(ENQUEUE_ACTION_IN_QUEUE, () => {

        it('should go to fourth state', () => {

            const action = generateAction(ENQUEUE_ACTION_IN_QUEUE, [actionInQueue])

            times(100, () => {
                expect(fourthState)
                    .toSixthStateFromAction(
                        action,
                        actionInQueue,
                        action.payload
                    )
            })

        })

    })

    describe(RETRY_ACTION_NOT_IN_QUEUE, () => {

        it('should go to fourth state', () => {

            const action = generateAction(RETRY_ACTION_NOT_IN_QUEUE, [actionInQueue])

            times(100, () => {
                expect(fourthState)
                    .toFourthStateFromAction(
                        action,
                        actionInQueue,
                    )
            })

        })

    })

    describe(RETRY_ACTION_IN_QUEUE, () => {

        it('should go to fourth state', () => {

            const action = generateAction(RETRY_ACTION_IN_QUEUE, [actionInQueue])

            times(100, () => {
                expect(fourthState)
                    .toFourthStateFromAction(
                        action,
                        actionInQueue,
                    )
            })

        })

    })

    describe(REMOVE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to fourth state', () => {

            const action = generateAction(REMOVE_ACTION_NOT_IN_QUEUE, [actionInQueue])

            times(100, () => {
                expect(fourthState)
                    .toFourthStateFromAction(
                        action,
                        actionInQueue,
                    )
            })

        })

    })

    describe(REMOVE_ACTION_IN_QUEUE, () => {

        it.only('should go to fourth state', () => {

            const action = generateAction(REMOVE_ACTION_IN_QUEUE, [actionInQueue])

            times(100, () => {
                expect(fourthState)
                    .toThirdStateFromAction(
                        action,
                    )
            })

        })

    })

    describe(REMOVE_ACTION_IN_QUEUE, () => {

        it.only('should go to fourth state', () => {

            const action = generateAction(REMOVE_ACTION_IN_QUEUE, [actionInQueue])

            times(100, () => {
                expect(fourthState)
                    .toThirdStateFromAction(
                        action,
                    )
            })

        })

    })

})

