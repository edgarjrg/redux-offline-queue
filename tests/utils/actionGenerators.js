import { AUTO_ENQUEUE, RETRY_ALL, RETRY, QUEUE_ACTION, REMOVE } from "../../src/actions";
import faker from 'faker';
import uuid from 'uuid/v1'

export function generateQueueableAction() {
    return {
        type: faker.random.word(),
        payload: {
        },
        meta: {
            queue: {
                enqueue: true
            }
        }
    }
}


export function generateNonQueueableAction(queue) {
    return {
        type: faker.random.word(),
        payload: faker.random.word(),
    }
}


export function generateQueueableActionInQueue(queue) {

    return faker.random.arrayElement(queue)

}


export function generateQueueableActionNotInQueue(queue) {
    return {
        type: faker.random.word(),
        payload: {
        },
        meta: {
            queue: {
                enqueue: true

            }
        }
    }
}

export function generateAutoEnqueueActionTrue(queue) {
    return {
        type: AUTO_ENQUEUE,
        payload: {
            value: true
        }
    }
}

export function generateAutoEnqueueActionFalse(queue) {
    return {
        type: AUTO_ENQUEUE,
        payload: {
            value: false
        }
    }
}

export function generateRetryAllAction(queue) {
    return {
        type: RETRY_ALL
    }
}

export function generateEnqueueActionActionNotInQueue(queue) {
    return {
        type: QUEUE_ACTION,
        payload: {
            ...generateQueueableActionNotInQueue(queue)
        }
    }
}

export function generateEnqueueActionActionInQueue(queue) {
    return {
        type: QUEUE_ACTION,
        payload: generateQueueableActionInQueue(queue)
    }
}

export function generateRetryActionActionNotInQueue(queue) {
    return {
        type: RETRY,
        payload: generateQueueableActionNotInQueue(queue)
    }
}

export function generateRetryActionActionInQueue(queue) {

    return {
        type: RETRY,
        payload: generateQueueableActionInQueue(queue)
    }

}

export function generateRemoveActionActionNotInQueue(queue) {

    return {
        type: REMOVE,
        payload: generateQueueableActionNotInQueue(queue)
    }

}

export function generateRemoveActionActionInQueue(queue) {

    return {
        type: REMOVE,
        payload: generateQueueableActionInQueue(queue)
    }

}

export function generateActionInQueue(queue) {

    return {
        type: faker.random.word(),
        payload: {
        },
        meta: {
            queue: {
                enqueue: true,
                id: uuid()
            }
        }
    }

}