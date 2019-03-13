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
    generateAction,
} from "./utils/actions";

describe('state: {autoEnqueue: false, queue: [a]}}', () => {

    const secondState = {
        offline: {
            autoEnqueue: true,
            queue: []
        }
    }

    describe(ANY_NON_QUEUEABLE_ACTION, () => {

        it('should go to third state', () => {

            times(100, () => {
                expect(secondState)
                    .toThirdStateFromAction(
                        generateAction(ANY_NON_QUEUEABLE_ACTION),
                    )
            })

        })

    })

    describe(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to fourth state', () => {

            times(100, () => {
                const secondAction = generateAction(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE)

                expect(secondState)
                    .toFourthStateFromAction(
                        secondAction,
                        secondAction
                    )
            })

        })

    })

    describe(ANY_QUEUEABLE_ACTION_IN_QUEUE, () => {

        it('should be impossible')

    })


    describe(AUTO_ENQUEUE_TRUE, () => {

        it('should go to third state', () => {

            times(100, () => {

                expect(secondState)
                    .toThirdStateFromAction(
                        generateAction(AUTO_ENQUEUE_TRUE),
                    )
            })

        })

    })

    describe(AUTO_ENQUEUE_FALSE, () => {

        it('should go to first state', () => {

            times(100, () => {

                expect(secondState)
                    .toFirstStateFromAction(
                        generateAction(AUTO_ENQUEUE_FALSE),
                    )
            })

        })

    })

    describe(RETRY_ALL, () => {

        it('should go to third state', () => {

            times(100, () => {

                expect(secondState)
                    .toThirdStateFromAction(
                        generateAction(RETRY_ALL),
                    )
            })

        })

    })

    describe(ENQUEUE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to fourth state', () => {

            times(100, () => {

                const action = generateAction(ENQUEUE_ACTION_NOT_IN_QUEUE);

                expect(secondState)
                    .toFourthStateFromAction(
                        action,
                        action.payload
                    )
            })

        })

    })

    describe(ENQUEUE_ACTION_IN_QUEUE, () => {

        it('should go to fourth state', () => {

            times(100, () => {

                const action = generateAction(ENQUEUE_ACTION_IN_QUEUE);

                expect(secondState)
                    .toFourthStateFromAction(
                        action,
                        action.payload
                    )
            })

        })

    })

    describe(RETRY_ACTION_NOT_IN_QUEUE, () => {

        it('should go to third state', () => {

            times(100, () => {

                const action = generateAction(RETRY_ACTION_NOT_IN_QUEUE);

                expect(secondState)
                    .toThirdStateFromAction(
                        action,
                    )
            })

        })

    })

    describe(RETRY_ACTION_IN_QUEUE, () => {

        it('should be impossible')

    })

    describe(REMOVE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to third state', () => {

            times(100, () => {

                const action = generateAction(REMOVE_ACTION_NOT_IN_QUEUE);

                expect(secondState)
                    .toThirdStateFromAction(
                        action,
                    )
            })

        })

    })

    describe(REMOVE_ACTION_IN_QUEUE, () => {

        it('should be impossible')

    })
})

