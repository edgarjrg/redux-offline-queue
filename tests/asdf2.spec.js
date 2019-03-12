import {
    FirstState2FirstStateBeforeEach,
    FirstState2SecondStateBeforeEach,
    // FirstState2ThirdStateBeforeEach,
    // FirstState2FourthStateBeforeEach,
    // FirstState2FifthStateBeforeEach,
    // FirstState2SixthStateBeforeEach
} from "./utls/firstState/tearups";

import { times } from "lodash";


const firstState = 'state: {autoEnqueue: false, queue: []}}'

const ThirdState = 'state: {autoEnqueue: true, queue: []}}'


const secondState = 'state: {autoEnqueue: false, queue: [a]}}'
const FourthState = 'state: {autoEnqueue: true, queue: [a]}}'
const FifthState = 'state: {autoEnqueue: false, queue: [a,b]}}'
const SixthState = 'state: {autoEnqueue: true, queue: [a,b]}}'



describe('state: {autoEnqueue: false, queue: []}}', () => {

    describe('to state: {autoEnqueue: false, queue: []}}', () => {

        it('{state: {autoQueue: false, queue: []}}', () => {
            times(100, () => {
                const { pipeline, startState, action } = FirstState2FirstStateBeforeEach()
                // console.log(action)
                const state = pipeline.store.getState()
                // console.log(state)
                expect(state).toEqual(startState)
            })
        })

        it('pass to final middleware', () => {

            times(100, () => {
                const { pipeline, action } = FirstState2FirstStateBeforeEach()

                expect(pipeline.gotToReducerSpy.mock.calls.length).toBeLessThanOrEqual(2)
                expect(pipeline.gotToReducerSpy).toHaveBeenCalledWith(action)
            })

        })

        it('pass to saga middleware', () => {

            times(100, () => {
                const { pipeline, action } = FirstState2FirstStateBeforeEach()
                expect(pipeline.sagaMiddlewareSpy.mock.calls.length).toBeLessThanOrEqual(2)
                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledWith(action)
            })

        })

        it('dont trigger add to queue', () => {

            times(100, () => {
                const { pipeline, action } = FirstState2FirstStateBeforeEach()
                expect(pipeline.dispatchSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.dispatchSpy).toHaveBeenCalledWith(action)
            })

        })

    })

    describe('to state: {autoEnqueue: false, queue: [a]}}', () => {

        it('{state: {autoQueue: false, queue: [a]}}', () => {
            times(100, () => {
                const { pipeline, startState, action } = FirstState2SecondStateBeforeEach()
                // console.log(action)
                const state = pipeline.store.getState()
                // console.log(state)
                expect(state).toEqual({
                    ...startState,
                    offline: {
                        ...startState.offline,
                        queue: [action.payload]
                    }
                })

            })
        })

        it('pass to final middleware', () => {

            times(100, () => {
                const { pipeline, action } = FirstState2SecondStateBeforeEach()

                expect(pipeline.gotToReducerSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.gotToReducerSpy).toHaveBeenCalledWith(action)
            })

        })

        it('pass to saga middleware', () => {

            times(100, () => {
                const { pipeline, action } = FirstState2SecondStateBeforeEach()
                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledWith(action)
            })

        })

        it('dont trigger add to queue', () => {

            times(100, () => {
                const { pipeline, action } = FirstState2SecondStateBeforeEach()
                expect(pipeline.dispatchSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.dispatchSpy).toHaveBeenCalledWith(action)
            })

        })

    })

    describe.skip('to state: {autoEnqueue: true, queue: []}}', () => {

        it('{state: {autoQueue: false, queue: []}}', () => {
            times(100, () => {
                const { pipeline, startState, action } = cositaMuyBonita()
                // console.log(action)
                const state = pipeline.store.getState()
                // console.log(state)
                expect(state).toEqual({
                    ...startState,
                    offline: {
                        ...startState.offline,
                        autoEnqueue: true
                    }
                })
            })
        })

        it('pass to final middleware', () => {

            times(100, () => {
                const { pipeline, action } = cositaMuyBonita()

                expect(pipeline.gotToReducerSpy.mock.calls.length).toBeLessThanOrEqual(2)
                expect(pipeline.gotToReducerSpy).toHaveBeenCalledWith(action)
            })

        })

        it('pass to saga middleware', () => {

            times(100, () => {
                const { pipeline, action } = cositaMuyBonita()
                expect(pipeline.sagaMiddlewareSpy.mock.calls.length).toBeLessThanOrEqual(2)
                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledWith(action)
            })

        })

        it('dont trigger add to queue', () => {

            times(100, () => {
                const { pipeline, action } = cositaMuyBonita()
                expect(pipeline.dispatchSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.dispatchSpy).toHaveBeenCalledWith(action)
            })

        })

    })

    describe.skip('to state: {autoEnqueue: true, queue: [a]}}', () => {


        it('{state: {autoQueue: false, queue: []}}', () => {
            times(100, () => {
                const { pipeline, startState, action } = cositaMuyBonita()
                // console.log(action)
                const state = pipeline.store.getState()
                // console.log(state)
                expect(state).toEqual({
                    ...startState,
                    offline: {
                        ...startState.offline,
                        autoEnqueue: true
                    }
                })
            })
        })

        it('pass to final middleware', () => {

            times(100, () => {
                const { pipeline, action } = cositaMuyBonita()

                expect(pipeline.gotToReducerSpy.mock.calls.length).toBeLessThanOrEqual(2)
                expect(pipeline.gotToReducerSpy).toHaveBeenCalledWith(action)
            })

        })

        it('pass to saga middleware', () => {

            times(100, () => {
                const { pipeline, action } = cositaMuyBonita()
                expect(pipeline.sagaMiddlewareSpy.mock.calls.length).toBeLessThanOrEqual(2)
                expect(pipeline.sagaMiddlewareSpy).toHaveBeenCalledWith(action)
            })

        })

        it('dont trigger add to queue', () => {

            times(100, () => {
                const { pipeline, action } = cositaMuyBonita()
                expect(pipeline.dispatchSpy).toHaveBeenCalledTimes(1)
                expect(pipeline.dispatchSpy).toHaveBeenCalledWith(action)
            })

        })

    })

})
