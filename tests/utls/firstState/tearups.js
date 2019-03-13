import initialState from '../../../src/initialState'
import { wholePipeline } from "../general/tearup";
import {
    // generateFirstState2FirstStateAction,
    generateFirstState2SecondStateAction,
    generateFirstState2ThirdStateAction,
    generateFirstState2FourthStateAction,
    // generateFirstState2FifthStateAction,
    // generateFirstState2SixthStateAction,
} from "./actionGenerators";

import {
    generateNonQueueableAction
} from "../general/actionGenerators";

export function FirstState2FirstStateBeforeEach() {
    const action = generateNonQueueableAction();
    const startState = { offline: { ...initialState } }
    const pipeline = wholePipeline()

    pipeline.store.dispatch(action)

    return {
        action,
        startState,
        pipeline
    }
}

export function FirstState2SecondStateBeforeEach() {
    const startState = { offline: { ...initialState } }
    const action = generateFirstState2SecondStateAction([]);
    const pipeline = wholePipeline()

    pipeline.store.dispatch(action)

    return {
        action,
        startState,
        pipeline
    }
}

export function FirstState2ThirdStateBeforeEach() {
    const action = generateFirstState2ThirdStateAction();
    const startState = { offline: { ...initialState } }
    const pipeline = wholePipeline()

    pipeline.store.dispatch(action)

    return {
        action,
        startState,
        pipeline
    }
}

export function FirstState2FourthStateBeforeEach() {
    const action = generateFirstState2FourthStateAction();
    const startState = { offline: { ...initialState } }
    const pipeline = wholePipeline()

    pipeline.store.dispatch(action)

    return {
        action,
        startState,
        pipeline
    }
}

export function FirstState2FifthStateBeforeEach() {

}

export function FirstState2SixthStateBeforeEach() {

}