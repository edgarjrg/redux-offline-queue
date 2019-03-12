import faker from 'faker';
import {
    generateAutoEnqueueActionFalse,
    generateAutoEnqueueActionTrue,
    generateEnqueueActionActionInQueue,
    generateEnqueueActionActionNotInQueue,
    generateNonQueueableAction,
    generateQueueableAction,
    generateQueueableActionInQueue,
    generateQueueableActionNotInQueue,
    generateRetryActionActionInQueue,
    generateRetryActionActionNotInQueue,
    generateRetryAllAction
} from "../general/actionGenerators";

export function generateFirstState2FirstStateAction(queue) {

    return faker.random.arrayElement([
        generateAutoEnqueueActionFalse(),
        generateRetryAllAction(),
        generateNonQueueableAction()
    ])

}

export function generateFirstState2SecondStateAction(queue) {

    return faker.random.arrayElement([
        generateEnqueueActionActionNotInQueue(queue)
    ])

}

export function generateFirstState2ThirdStateAction(queue) {

}

export function generateFirstState2FourthStateAction(queue) {
    return faker.random.arrayElement([
        generateAutoEnqueueActionTrue()
    ])
}

export function generateFirstState2FifthStateAction(queue) {

}

export function generateFirstState2SixthStateAction(queue) {

}