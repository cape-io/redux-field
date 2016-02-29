import noop from 'lodash/noop'
import _createAction, { payloadCreatorDefault } from './createAction'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'

export function getPrefix(prefix) {
  if (prefix && isString(prefix)) {
    return prefix.split('.')
  }
  if (isArray(prefix) && !isEmpty(prefix)) {
    return prefix
  }
  return [ 'default' ]
}

export function getMeta(...args) {
  if (args[0] === null) {
    return { prefix: args.slice(1) }
  }
  return { prefix: args }
}
export function getMetaAfterPayload(payload, ...args) {
  return getMeta(...args)
}
export function getPayload(payload) {
  if (!payload) return payload
  if (payload.target && payload.nativeEvent) {
    return payload.target.value || ''
  }
  return payloadCreatorDefault(payload)
}
export function createAction(type, hasPayload = true) {
  if (hasPayload) {
    return _createAction(type, getPayload, getMetaAfterPayload)
  }
  return _createAction(type, noop, getMeta)
}
