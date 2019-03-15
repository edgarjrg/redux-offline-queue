describe.skip('', () => {
    const state1 = {
        autoEnqueue: false,
        queue: []
    }

    const state2 = {
        autoEnqueue: false,
        queue: ['a']
    }

    const state3 = {
        autoEnqueue: true,
        queue: []
    }

    const state4 = {
        autoEnqueue: true,
        queue: ['a']
    }

    const state5 = {
        autoEnqueue: false,
        queue: ['a', 'b']
    }

    const state6 = {
        autoEnqueue: true,
        queue: ['a', 'b']
    }

    /**
     * [
     *  [
     *      from state,
     *      [can go to states],
     *      [can not got to states]
     *  ]
     * ]
     */

    const ANY_NON_QUEUEABLE_ACTION = 'any non queueable action';
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



    // ANY_NON_QUEUEABLE_ACTION
    // ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE
    // ANY_QUEUEABLE_ACTION_IN_QUEUE
    // AUTO_ENQUEUE_TRUE
    // AUTO_ENQUEUE_FALSE
    // RETRY_ALL
    // ENQUEUE_ACTION_NOT_IN_QUEUE
    // ENQUEUE_ACTION_IN_QUEUE
    // RETRY_ACTION_NOT_IN_QUEUE
    // RETRY_ACTION_IN_QUEUE
    // REMOVE_ACTION_NOT_IN_QUEUE
    // REMOVE_ACTION_IN_QUEUE

    type state = {
        autoEnqueue: boolean,
        queue: any[]
    }

    type fromState = state
    type toState = state

    type actionThatCanGetToThisState = string
    type imposisibleActionsInThisState = string
    type actionThatWillNotGetToThisState = string
    type possibleAction = string

    type combinations = [
        [
            fromState,
            [
                toState,
                actionThatCanGetToThisState[],
                imposisibleActionsInThisState[],
                actionThatWillNotGetToThisState[]
            ]
        ]
    ]

    type sideeffect = string

    type combinations2 = [
        [
            fromState,
            [
                possibleAction,
                state,
                sideeffect[]
            ]
        ]
    ]

    const combinations =
        [
            [
                state1,
                [
                    [
                        state1,
                        [
                            ANY_NON_QUEUEABLE_ACTION,
                            ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE,
                            ANY_QUEUEABLE_ACTION_IN_QUEUE,
                            // AUTO_ENQUEUE_TRUE,
                            AUTO_ENQUEUE_FALSE,
                            RETRY_ALL,
                            // ENQUEUE_ACTION_NOT_IN_QUEUE,
                            // ENQUEUE_ACTION_IN_QUEUE,
                            // RETRY_ACTION_NOT_IN_QUEUE,
                            // RETRY_ACTION_IN_QUEUE,
                            REMOVE_ACTION_NOT_IN_QUEUE,
                            // REMOVE_ACTION_IN_QUEUE,
                        ],
                        [
                            // ANY_NON_QUEUEABLE_ACTION,
                            // ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE,
                            ANY_QUEUEABLE_ACTION_IN_QUEUE,
                            // AUTO_ENQUEUE_TRUE,
                            // AUTO_ENQUEUE_FALSE,
                            // RETRY_ALL,
                            // ENQUEUE_ACTION_NOT_IN_QUEUE,
                            ENQUEUE_ACTION_IN_QUEUE,
                            // RETRY_ACTION_NOT_IN_QUEUE,
                            RETRY_ACTION_IN_QUEUE,
                            // REMOVE_ACTION_NOT_IN_QUEUE,
                            REMOVE_ACTION_IN_QUEUE,
                        ]
                    ],
                    [
                        state2,
                        // [
                        //     ANY_NON_QUEUEABLE_ACTION,
                        //     ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE,
                        //     ANY_QUEUEABLE_ACTION_IN_QUEUE,
                        //     AUTO_ENQUEUE_TRUE,
                        //     AUTO_ENQUEUE_FALSE,
                        //     RETRY_ALL,
                        //     ENQUEUE_ACTION_NOT_IN_QUEUE,
                        //     ENQUEUE_ACTION_IN_QUEUE,
                        //     RETRY_ACTION_NOT_IN_QUEUE,
                        //     RETRY_ACTION_IN_QUEUE,
                        //     REMOVE_ACTION_NOT_IN_QUEUE,
                        //     REMOVE_ACTION_IN_QUEUE,
                        // ]
                    ],
                    [
                        state3,
                        // [
                        //     ANY_NON_QUEUEABLE_ACTION,
                        //     ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE,
                        //     ANY_QUEUEABLE_ACTION_IN_QUEUE,
                        //     AUTO_ENQUEUE_TRUE,
                        //     AUTO_ENQUEUE_FALSE,
                        //     RETRY_ALL,
                        //     ENQUEUE_ACTION_NOT_IN_QUEUE,
                        //     ENQUEUE_ACTION_IN_QUEUE,
                        //     RETRY_ACTION_NOT_IN_QUEUE,
                        //     RETRY_ACTION_IN_QUEUE,
                        //     REMOVE_ACTION_NOT_IN_QUEUE,
                        //     REMOVE_ACTION_IN_QUEUE,
                        // ]
                    ]
                ],
                [
                    [
                        state4,
                        // [
                        //     ANY_NON_QUEUEABLE_ACTION,
                        //     ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE,
                        //     ANY_QUEUEABLE_ACTION_IN_QUEUE,
                        //     AUTO_ENQUEUE_TRUE,
                        //     AUTO_ENQUEUE_FALSE,
                        //     RETRY_ALL,
                        //     ENQUEUE_ACTION_NOT_IN_QUEUE,
                        //     ENQUEUE_ACTION_IN_QUEUE,
                        //     RETRY_ACTION_NOT_IN_QUEUE,
                        //     RETRY_ACTION_IN_QUEUE,
                        //     REMOVE_ACTION_NOT_IN_QUEUE,
                        //     REMOVE_ACTION_IN_QUEUE,
                        // ]
                    ],
                    state5,
                    state6,
                ]
            ],
            [
                state2,
                [
                    state1,
                    state2,
                    state4,
                    state5,
                ],
                [
                    state3,
                    state6,
                ]
            ],
            [
                state3,
                [
                    state1,
                    state3,
                    state4,
                ],
                [
                    state2,
                    state5,
                    state6,
                ]
            ],
            [
                state4,
                [
                    state2,
                    state3,
                    state4,
                    state6,
                ],
                [
                    state1,
                    state5,
                ]
            ],
            [
                state5,
                [
                    state1,
                    state2,
                    state5,
                ],
                [
                    state3,
                    state4,
                    state6,
                ]
            ],
            [
                state6,
                [
                    state3,
                    state4,
                    state5,
                    state6,
                ],
                [
                    state1,
                    state2,
                ]
            ]
        ]

    const combinations2 = [
        [
            state1,
            [
                [
                    ANY_NON_QUEUEABLE_ACTION,
                    [
                        state1,
                    ]
                ],
                [
                    ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE,
                    [
                        state1,
                    ]
                ],
                [
                    // impossible
                    ANY_QUEUEABLE_ACTION_IN_QUEUE,
                    [
                        state1,
                    ]
                ],
                [
                    AUTO_ENQUEUE_TRUE,
                    [
                        state3,
                    ]
                ],
                [
                    AUTO_ENQUEUE_FALSE,
                    [
                        state1,
                    ]
                ],
                [
                    RETRY_ALL,
                    [
                        state1,
                    ]
                ],
                [
                    ENQUEUE_ACTION_NOT_IN_QUEUE,
                    [
                        state2,
                    ]
                ],
                [
                    // impossible
                    ENQUEUE_ACTION_IN_QUEUE,
                    [
                        state1,
                    ]
                ],
                [
                    RETRY_ACTION_NOT_IN_QUEUE,
                    [
                        state1,
                    ]
                ],
                [
                    // impossible
                    RETRY_ACTION_IN_QUEUE,
                    [
                        state1,
                    ]
                ],
                [
                    REMOVE_ACTION_NOT_IN_QUEUE,
                    [
                        state1,
                    ]
                ],
                [
                    // impossible
                    REMOVE_ACTION_IN_QUEUE,
                ],
            ],
        ],
        [
            state2,
            [
                [
                    ANY_NON_QUEUEABLE_ACTION,
                    [
                        state2,
                    ]
                ],
                [
                    ANY_QUEUEABLE_ACTION_NOT_IN_QUEUE,
                    [
                        state2,
                    ]
                ],
                [
                    ANY_QUEUEABLE_ACTION_IN_QUEUE,
                    [
                        state2,
                    ]
                ],
                [
                    AUTO_ENQUEUE_TRUE,
                    [
                        state4,
                    ]
                ],
                [
                    AUTO_ENQUEUE_FALSE,
                    [
                        state2,
                    ]
                ],
                [
                    RETRY_ALL,
                    [
                        state1,
                    ]
                ],
                [
                    ENQUEUE_ACTION_NOT_IN_QUEUE,
                    [
                        state5,
                    ]
                ],
                [
                    ENQUEUE_ACTION_IN_QUEUE,
                    [
                        state5,
                    ]
                ],
                [
                    RETRY_ACTION_NOT_IN_QUEUE,
                    [
                        state2,
                    ]
                ],
                [
                    RETRY_ACTION_IN_QUEUE,
                    [
                        state1,
                    ]
                ],
                [
                    REMOVE_ACTION_NOT_IN_QUEUE,
                    [
                        state2,
                    ]
                ],
                [
                    REMOVE_ACTION_IN_QUEUE,
                    [
                        state1
                    ]
                ],
            ],
        ],
    ]
})