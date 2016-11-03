import isError from 'lodash/isError'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import isUndefined from 'lodash/isUndefined'
import pickBy from 'lodash/pickBy'

export function payloadCreatorDefault(payload) {
  if (isError(payload) || isObject(payload)) {
    return pickBy(payload, val => !isUndefined(val) && !isFunction(val))
  }
  return payload
}
export default function createAction(type, payloadCreator, metaCreator) {
  const getPayload = isFunction(payloadCreator) ? payloadCreator : payloadCreatorDefault
  return (...args) => {
    const action = { type }
    const payload = getPayload(...args)
    if (!isUndefined(payload)) action.payload = payload
    // Handle FSA errors where the payload is an Error object or has error prop. Set error.
    if (args[0] && (isError(args[0]) || args[0].error || args[0].isBoom)) {
      action.error = true
    }
    if (isFunction(metaCreator)) {
      action.meta = metaCreator(...args)
    }
    return action
  }
}
