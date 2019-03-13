import { times } from "lodash";
import {
    generateNonQueueableAction,
    generateQueueableAction,
    generateQueueableActionNotInQueue,
    generateQueueableActionInQueue,
    generateAutoEnqueueActionTrue,
    generateAutoEnqueueActionFalse,
    generateRetryAllAction,
    generateEnqueueActionActionNotInQueue,
    generateEnqueueActionActionInQueue,
    generateRetryActionActionNotInQueue,
    generateRetryActionActionInQueue,
    generateRemoveActionActionNotInQueue,
    generateRemoveActionActionInQueue
} from "./utils/actionGenerators";

const ANY_NON_QUEUEABLE_ACTION = 'ANY_NON_QUEUEABLE_ACTION';
const ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE = 'ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE'
const ANY_QUEUEABLE_ACTION_IN_QUEUE = 'ANY_QUEUEABLE_ACTION_IN_QUEUE'
const AUTO_ENQUEUE_TRUE = 'AUTO_ENQUEUE_TRUE'
const AUTO_ENQUEUE_FALSE = 'AUTO_ENQUEUE_FALSE'
const RETRY_ALL = 'RETRY_ALL'
const ENQUEUE_ACTION_NOT_IN_QUEUE = 'ENQUEUE_ACTION_NOT_IN_QUEUE'
const ENQUEUE_ACTION_IN_QUEUE = 'ENQUEUE_ACTION_IN_QUEUE'
const RETRY_ACTION_NOT_IN_QUEUE = 'RETRY_ACTION_NOT_IN_QUEUE'
const RETRY_ACTION_IN_QUEUE = 'RETRY_ACTION_IN_QUEUE'

const REMOVE_ACTION_NOT_IN_QUEUE = 'REMOVE_ACTION_NOT_IN_QUEUE'
const REMOVE_ACTION_IN_QUEUE = 'REMOVE_ACTION_IN_QUEUE'

describe('state: {autoEnqueue: false, queue: []}}', () => {

    describe(ANY_NON_QUEUEABLE_ACTION, () => {

        it('should go to first state', () => {

            times(100, () => {
                expect({
                    offline: {
                        autoEnqueue: false,
                        queue: []
                    }
                }).toFirstStateFromAction(
                    generateNonQueueableAction()
                )
            })

        })

    })

    describe(ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to first state', () => {

            times(100, () => {
                expect({
                    offline: {
                        autoEnqueue: false,
                        queue: []
                    }
                }).toFirstStateFromAction(
                    generateQueueableActionNotInQueue()
                )
            })


        })

    })

    describe(ANY_QUEUEABLE_ACTION_IN_QUEUE, () => {
        it('should be imposible')
    })

    describe(AUTO_ENQUEUE_TRUE, () => {

        it('should go to third state', () => {

            times(100, () => {
                expect({
                    offline: {
                        autoEnqueue: false,
                        queue: []
                    }
                }).toThirdStateFromAction(
                    generateAutoEnqueueActionTrue()
                )
            })

        })
    })

    describe(AUTO_ENQUEUE_FALSE, () => {

        it('should go to first state', () => {

            times(100, () => {
                expect({
                    offline: {
                        autoEnqueue: false,
                        queue: []
                    }
                }).toFirstStateFromAction(
                    generateAutoEnqueueActionFalse()
                )
            })

        })
    })

    describe(RETRY_ALL, () => {

        it('should go to first state', () => {

            times(100, () => {
                expect({
                    offline: {
                        autoEnqueue: false,
                        queue: []
                    }
                }).toFirstStateFromAction(
                    generateRetryAllAction()
                )
            })


        })
    })

    describe(ENQUEUE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to second state', () => {

            times(100, () => {
                const action = generateEnqueueActionActionNotInQueue();
                expect({
                    offline: {
                        autoEnqueue: false,
                        queue: []
                    }
                }).toSecondStateFromAction(
                    action,
                    action.payload
                )
            })

        })

    })

    describe(ENQUEUE_ACTION_IN_QUEUE, () => {

        it('should be impossible')

    })

    describe(RETRY_ACTION_NOT_IN_QUEUE, () => {

        it('should go to first state', () => {

            times(100, () => {
                expect({
                    offline: {
                        autoEnqueue: false,
                        queue: []
                    }
                }).toFirstStateFromAction(
                    generateRetryActionActionInQueue()
                )
            })
        })
    })

    describe(RETRY_ACTION_IN_QUEUE, () => {

        it('should be impossible')

    })

    describe(REMOVE_ACTION_NOT_IN_QUEUE, () => {

        it('should go to first state', () => {
            times(100, () => {
                expect({
                    offline: {
                        autoEnqueue: false,
                        queue: []
                    }
                }).toFirstStateFromAction(
                    generateRemoveActionActionNotInQueue()
                )
            })

        })
    })

    describe(REMOVE_ACTION_IN_QUEUE, () => {

        it('should be impossible')

    })

})

