import diff from "jest-diff";
import { wholePipeline } from "../tests/utls/general/tearup";

expect.extend({

    toFirstStateFromAction(preloadedState, action) {

        const options = {
            comment: 'Object.is equality',
            isNot: this.isNot,
            promise: this.promise,
        };

        const pipeline = wholePipeline(preloadedState)

        pipeline.store.dispatch(action)
        const state = pipeline.store.getState()

        const expected = {
            offline: {
                autoEnqueue: false,
                queue: []
            }
        }

        const pass = this.equals(state, expected)

        return {
            pass,
            message: pass
                ? () =>
                    this.utils.matcherHint('toBe', undefined, undefined, options) +
                    '\n\n' +
                    `Expected: ${this.utils.printExpected(expected)}\n` +
                    `Received: ${this.utils.printReceived(received)}`
                : () => {
                    const difference = diff(expected, state, {
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
    },
    toSecondStateFromAction(preloadedState, action, actionInQueue) {

        const options = {
            comment: 'Object.is equality',
            isNot: this.isNot,
            promise: this.promise,
        };

        const pipeline = wholePipeline(preloadedState)

        pipeline.store.dispatch(action)
        const state = pipeline.store.getState()

        const expected = {
            offline: {
                autoEnqueue: false,
                queue: [actionInQueue]
            }
        }

        const pass = this.equals(state, expected)

        return {
            pass,
            message: pass
                ? () =>
                    this.utils.matcherHint('toBe', undefined, undefined, options) +
                    '\n\n' +
                    `Expected: ${this.utils.printExpected(expected)}\n` +
                    `Received: ${this.utils.printReceived(received)}`
                : () => {
                    const difference = diff(expected, state, {
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
    },
    toThirdStateFromAction(preloadedState, action) {

        const options = {
            comment: 'Object.is equality',
            isNot: this.isNot,
            promise: this.promise,
        };

        const pipeline = wholePipeline(preloadedState)

        pipeline.store.dispatch(action)
        const state = pipeline.store.getState()

        const expected = {
            offline: {
                autoEnqueue: true,
                queue: []
            }
        }

        const pass = this.equals(state, expected)

        return {
            pass,
            message: pass
                ? () =>
                    this.utils.matcherHint('toBe', undefined, undefined, options) +
                    '\n\n' +
                    `Expected: ${this.utils.printExpected(expected)}\n` +
                    `Received: ${this.utils.printReceived(received)}`
                : () => {
                    const difference = diff(expected, state, {
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
    },
    toFourthStateFromAction(preloadedState, action, actionInQueue) {

        const options = {
            comment: 'Object.is equality',
            isNot: this.isNot,
            promise: this.promise,
        };

        const pipeline = wholePipeline(preloadedState)

        pipeline.store.dispatch(action)
        const state = pipeline.store.getState()

        const expected = {
            offline: {
                autoEnqueue: true,
                queue: [actionInQueue]
            }
        }

        const pass = this.equals(state, expected)

        return {
            pass,
            message: pass
                ? () =>
                    this.utils.matcherHint('toBe', undefined, undefined, options) +
                    '\n\n' +
                    `Expected: ${this.utils.printExpected(expected)}\n` +
                    `Received: ${this.utils.printReceived(received)}`
                : () => {
                    const difference = diff(expected, state, {
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
    },
    toFiftStateFromAction(preloadedState, action, actionInQueue1, actionInQueue2) {

        const options = {
            comment: 'Object.is equality',
            isNot: this.isNot,
            promise: this.promise,
        };

        const pipeline = wholePipeline(preloadedState)

        pipeline.store.dispatch(action)
        const state = pipeline.store.getState()

        const expected = {
            offline: {
                autoEnqueue: false,
                queue: [actionInQueue1, actionInQueue2]
            }
        }

        const pass = this.equals(state, expected)

        return {
            pass,
            message: pass
                ? () =>
                    this.utils.matcherHint('toBe', undefined, undefined, options) +
                    '\n\n' +
                    `Expected: ${this.utils.printExpected(expected)}\n` +
                    `Received: ${this.utils.printReceived(received)}`
                : () => {
                    const difference = diff(expected, state, {
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
    },
    toSixthStateFromAction(preloadedState, action, actionInQueue1, actionInQueue2) {

        const options = {
            comment: 'Object.is equality',
            isNot: this.isNot,
            promise: this.promise,
        };

        const pipeline = wholePipeline(preloadedState)

        pipeline.store.dispatch(action)
        const state = pipeline.store.getState()

        const expected = {
            offline: {
                autoEnqueue: true,
                queue: [actionInQueue1, actionInQueue2]
            }
        }

        const pass = this.equals(state, expected)

        return {
            pass,
            message: pass
                ? () =>
                    this.utils.matcherHint('toBe', undefined, undefined, options) +
                    '\n\n' +
                    `Expected: ${this.utils.printExpected(expected)}\n` +
                    `Received: ${this.utils.printReceived(received)}`
                : () => {
                    const difference = diff(expected, state, {
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
    },
})