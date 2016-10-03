import curry from 'lodash/curry'
import noop from 'lodash/noop'
import _createAction, { payloadCreatorDefault } from './createAction'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import mapValues from 'lodash/mapValues'
import partial from 'lodash/partial'

export function getPrefix(prefix) {
  if (prefix && isString(prefix)) {
    return prefix.split('.')
  }
  if (isArray(prefix) && !isEmpty(prefix)) {
    return prefix
  }
  if (isObject(prefix) && prefix.fieldId && prefix.formId) {
    return [ prefix.formId, prefix.fieldId ]
  }
  return [ 'default' ]
}

export function getMeta(_prefix, payload, extraMeta) {
  const prefix = getPrefix(_prefix)
  return isObject(extraMeta) ? { ...extraMeta, prefix } : { prefix }
}
export function getPayload(prefix, payload) {
  if (!payload) return payload
  if (payload.target && payload.nativeEvent) {
    return payload.target.value || ''
  }
  return payloadCreatorDefault(payload)
}
export function createAction(type, hasPayload = true) {
  return _createAction(type, hasPayload ? getPayload : noop, getMeta)
}
export function getProgress(value) {
  if (isObject(value) && value.loaded && value.total) {
    return parseInt((value.loaded / value.total) * 100, 10)
  }
  return parseInt(value, 10)
}
export const mapPartial = curry((obj, arg0) => mapValues(obj, func => partial(func, arg0)))
