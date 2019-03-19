
import uuid from 'uuid/v1'
import { over, lensPath } from 'ramda';
import moment from 'moment'

export function enhace(action) {

    return over(
        lensPath(['meta', 'queue']),
        meta => ({
            ...meta,
            id: meta.id || uuid(),
            times: (meta.times || 0) + 1,
            ttl: meta.ttl || moment().toISOString(),
            throttle: moment().add(1, 'minute').toISOString(),
        }),
        action
    )

}

export function enhaceInitial(action) {

    return over(
        lensPath(['meta', 'queue']),
        meta => ({
            ...meta,
            id: meta.id || uuid(),
            times: meta.times || 0,
        }),
        action
    )

}