
import uuid from 'uuid/v1'
import { over } from 'ramda';
import moment from 'moment'
import { metaPath } from '../../tests/utils/utils';

export function enhace(action) {

    return over(
        metaPath,
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
        metaPath,
        meta => ({
            ...meta,
            id: meta.id || uuid(),
            times: meta.times || 0,
        }),
        action
    )

}