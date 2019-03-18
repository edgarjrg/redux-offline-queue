import diff from "jest-diff";
import { wholePipeline } from "../tests/utils/tearup";
import { omitQueuedActionsIdsFromState, omitId, allHaveId, omitLastQueuedActionsIdFromState, omitLastQueuedActionsId } from "../tests/utils/utils";

expect.extend({
    toFirstStateFromAction(preloadedState, action) {

        const pipeline = wholePipeline(preloadedState)

        pipeline.store.dispatch(action)
        const state = pipeline.store.getState()

        const expected = {
            offline: {
                suspendSaga: true,
                queue: []
            }
        }

        const pass = this.equals(state, expected)

        return {
            pass,
            message: generateMatcherDiffMessage.call(this, pass, state, expected)
        }
    },
    toSecondStateFromAction(preloadedState, action, actionInQueue) {

        const pipeline = wholePipeline(preloadedState)

        pipeline.store.dispatch(action)
        const state = pipeline.store.getState()

        const expected = {
            offline: {
                suspendSaga: true,
                queue: [actionInQueue]
            }
        }

        const pass = this.equals(state, expected)

        return {
            pass,
            message: generateMatcherDiffMessage.call(this, pass, state, expected)
        }
    },
    toSecondStateFromCreationAction(preloadedState, action, actionInQueue) {

        const pipeline = wholePipeline(preloadedState)

        pipeline.store.dispatch(action)

        const actionInQueueToCompare = omitId(actionInQueue)

        const originalState = pipeline.store.getState()

        const state = omitQueuedActionsIdsFromState(originalState)

        const hasId = allHaveId(originalState)

        // console.log(JSON.stringify(originalState))

        const expected = {
            offline: {
                suspendSaga: true,
                queue: [actionInQueueToCompare]
            }
        }

        const pass = !!(hasId && this.equals(state, expected))

        return {
            pass,
            message: (hasId)
                ? generateMatcherDiffMessage.call(this, pass, state, expected)
                : () => 'returned state does not have id'
        }
    },
    toThirdStateFromAction(preloadedState, action) {

        const pipeline = wholePipeline(preloadedState)

        pipeline.store.dispatch(action)
        const state = pipeline.store.getState()

        const expected = {
            offline: {
                suspendSaga: false,
                queue: []
            }
        }

        const pass = this.equals(state, expected)

        return {
            pass,
            message: generateMatcherDiffMessage.call(this, pass, state, expected)
        }
    },
    toFourthStateFromAction(preloadedState, action, actionInQueue) {

        const pipeline = wholePipeline(preloadedState)

        pipeline.store.dispatch(action)
        const state = pipeline.store.getState()

        const expected = {
            offline: {
                suspendSaga: false,
                queue: [actionInQueue]
            }
        }

        const pass = this.equals(state, expected)

        return {
            pass,
            message: generateMatcherDiffMessage.call(this, pass, state, expected)
        }
    },
    toFourthStateFromCreationAction(preloadedState, action, actionInQueue) {

        const pipeline = wholePipeline(preloadedState)

        pipeline.store.dispatch(action)

        const actionInQueueToCompare = omitId(actionInQueue)

        const originalState = pipeline.store.getState()

        const state = omitQueuedActionsIdsFromState(originalState)

        const hasId = allHaveId(originalState)

        const expected = {
            offline: {
                suspendSaga: false,
                queue: [actionInQueueToCompare]
            }
        }

        const pass = !!(hasId && this.equals(state, expected))

        return {
            pass,
            message: generateMatcherDiffMessage.call(this, pass, state, expected)
        }
    },
    toFiftStateFromAction(preloadedState, action, ...queue) {

        const pipeline = wholePipeline(preloadedState)

        pipeline.store.dispatch(action)

        const received = pipeline.store.getState()

        const expected = {
            offline: {
                suspendSaga: true,
                queue: queue
            }
        }

        const pass = this.equals(received, expected)

        return {
            pass,
            message: generateMatcherDiffMessage.call(this, pass, received, expected)
        }
    },
    toFiftStateFromCreationAction(preloadedState, action, ...queue) {

        const pipeline = wholePipeline(preloadedState)

        pipeline.store.dispatch(action)

        const state = pipeline.store.getState()

        const hasId = allHaveId(state)

        const received = omitLastQueuedActionsIdFromState(state)

        const expected = {
            offline: {
                suspendSaga: true,
                queue: omitLastQueuedActionsId(queue)
            }
        }

        // console.log('action', JSON.stringify(action))
        // console.log('state', JSON.stringify(state))
        // console.log('queue', JSON.stringify(queue))

        const pass = !!(hasId && this.equals(received, expected))

        return {
            pass,
            message: (hasId)
                ? generateMatcherDiffMessage.call(this, pass, received, expected)
                : () => 'returned state does not have id'
        }
    },
    toSixthStateFromAction(preloadedState, action, ...queue) {

        const pipeline = wholePipeline(preloadedState)

        pipeline.store.dispatch(action)
        const state = pipeline.store.getState()

        const expected = {
            offline: {
                suspendSaga: false,
                queue: queue
            }
        }

        const pass = this.equals(state, expected)

        return {
            pass,
            message: generateMatcherDiffMessage.call(this, pass, state, expected)
        }
    },
    toSixthStateFromCreationAction(preloadedState, action, ...queue) {

        const pipeline = wholePipeline(preloadedState)

        pipeline.store.dispatch(action)

        const state = pipeline.store.getState()

        const received = omitLastQueuedActionsIdFromState(state)

        const hasId = allHaveId(state)

        const expected = {
            offline: {
                suspendSaga: false,
                queue: queue
            }
        }

        const pass = !!(hasId && this.equals(received, expected))

        return {
            pass,
            message: (hasId)
                ? generateMatcherDiffMessage.call(this, pass, received, expected)
                : () => 'returned state does not have id'
        }
    },
})

function generateMatcherDiffMessage(pass, received, expected) {

    const options = {
        comment: 'Object.is equality',
        isNot: this.isNot,
        promise: this.promise,
    };

    return pass
        ? () =>
            this.utils.matcherHint('toBe', undefined, undefined, options) +
            '\n\n' +
            `Expected: ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(received)}`
        : () => {
            const difference = diff(expected, received, {
                expand: this.expand,
            });
            return (
                this.utils.matcherHint('toBe', undefined, undefined, options) +
                '\n\n' +
                (difference && difference.includes('- Expect')
                    ? `Difference:\n\n${difference}`
                    : `Expected: ${this.utils.printExpected(expected)}\n` +
                    `Received: ${this.utils.printReceived(received)}`)
            );
        }
}