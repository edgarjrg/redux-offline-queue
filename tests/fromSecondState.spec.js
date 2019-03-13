import { times } from "lodash";

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
    generateAction
} from "./utls/firstState/actions";

describe('state: {autoEnqueue: false, queue: [a]}}', () => {

    const actionInQueue1 = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE)
    const secondState = {
        offline: {
            autoEnqueue: false,
            queue: [actionInQueue1]
        }
    }

    describe(ANY_NON_QUEUEABLE_ACTION, () => {

        it('should go to second state', () => {

            times(100, () => {
                expect(secondState)
                    .toSecondStateFromAction(
                        generateAction(ANY_NON_QUEUEABLE_ACTION),
                        actionInQueue1
                    )
            })

        })

    })

    describe(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to second state', () => {

            times(100, () => {
                expect(secondState)
                    .toSecondStateFromAction(
                        generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE),
                        actionInQueue1
                    )
            })

        })

    })

    describe(ANY_QUEUEABLE_ACTION_IN_QUEUE, () => {

        it('should go to second state', () => {

            times(100, () => {
                expect(secondState)
                    .toSecondStateFromAction(
                        generateAction(ANY_QUEUEABLE_ACTION_IN_QUEUE, [actionInQueue1]),
                        actionInQueue1
                    )
            })

        })

    })

    describe(AUTO_ENQUEUE_TRUE, () => {

        it('should go to fourth state', () => {

            times(100, () => {
                expect(secondState)
                    .toFourthStateFromAction(
                        generateAction(AUTO_ENQUEUE_TRUE),
                        actionInQueue1
                    )
            })

        })

    })

    describe(AUTO_ENQUEUE_FALSE, () => {

        it('should go to second state', () => {

            times(100, () => {
                expect(secondState)
                    .toSecondStateFromAction(
                        generateAction(AUTO_ENQUEUE_FALSE),
                        actionInQueue1
                    )
            })

        })

    })

    describe(ENQUEUE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to first state', () => {

            times(100, () => {
                const secondAction = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE)
                expect(secondState)
                    .toFiftStateFromAction(
                        secondAction,
                        actionInQueue1,
                        secondAction.payload
                    )
            })

        })

    })

    describe(ENQUEUE_ACTION_IN_QUEUE, () => {

        it('should go to fifth state', () => {

            times(100, () => {
                const secondAction = generateAction(ENQUEUE_ACTION_IN_QUEUE, [actionInQueue1])
                expect(secondState)
                    .toFiftStateFromAction(
                        secondAction,
                        actionInQueue1,
                        secondAction.payload
                    )
            })

        })

    })

    describe(REMOVE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to second state', () => {

            times(100, () => {

                const secondAction = generateAction(REMOVE_ACTION_NOT_IN_QUEUE, [actionInQueue1])

                expect(secondState)
                    .toSecondStateFromAction(
                        secondAction,
                        actionInQueue1
                    )
            })

        })

    })

    describe(REMOVE_ACTION_IN_QUEUE, () => {

        it('should go to fifth state', () => {

            times(100, () => {

                const secondAction = generateAction(REMOVE_ACTION_IN_QUEUE, [actionInQueue1])

                expect(secondState)
                    .toSecondStateFromAction(
                        secondAction,
                        actionInQueue1
                    )
            })

        })

    })

    describe(RETRY_ACTION_NOT_IN_QUEUE, () => {

        it('should go to fifth state', () => {

            times(100, () => {

                const secondAction = generateAction(RETRY_ACTION_NOT_IN_QUEUE, [actionInQueue1])

                expect(secondState)
                    .toSecondStateFromAction(
                        secondAction,
                        actionInQueue1
                    )
            })

        })

    })

    describe(RETRY_ACTION_IN_QUEUE, () => {

        it('should go to fifth state', () => {

            times(100, () => {

                const secondAction = generateAction(RETRY_ACTION_IN_QUEUE, [actionInQueue1])

                expect(secondState)
                    .toSecondStateFromAction(
                        secondAction,
                        actionInQueue1
                    )
            })

        })

    })

    describe(RETRY_ALL, () => {

        it('should go to fifth state', () => {

            times(100, () => {

                const secondAction = generateAction(RETRY_ALL, [actionInQueue1])

                expect(secondState)
                    .toFirstStateFromAction(
                        secondAction
                    )
            })

        })

    })

})

