import { lensPath, over, omit, map, view, reduce, all, lensIndex, filter } from "ramda";

export function actionsLeft(queue, actionToFind) {
    return filter(
        action => {
            return action.meta.queue.id !== actionToFind.payload.meta.queue.id
        },
        queue,
    )
}

export const metaPath = lensPath(['meta', 'queue'])
export const metaIdPath = lensPath(['meta', 'queue', 'id'])


export
    const omitId = over(
        metaPath,
        omit(['id']),
    )


export const omitQueuedActionsIdsFromState = over(
    lensPath(['offline', 'queue']),
    map(
        omitId
    )
)

export const allHaveId = (state) => {

    const queue = view(lensPath(['offline', 'queue']), state)
    const isUUID = (x) => typeof view(metaIdPath, x) === 'string'

    // console.log('queue', JSON.stringify(queue))

    if (queue) {
        return all(isUUID, queue)
    } else {
        return false
    }

}


export function incrementMetaCounter(action) {
    return over(
        metaPath,
        meta => ({
            ...meta,
            times: 1
        }),
        action
    )

}

export const omitLastQueuedActionsIdFromState = state => over(
    lensPath(['offline', 'queue']),
    omitLastQueuedActionsId,
    state
)

export const omitLastQueuedActionsId = queue => over(
    lensIndex(queue.length - 1),
    omitId,
    queue
)