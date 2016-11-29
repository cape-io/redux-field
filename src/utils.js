import { curry, noop, isArray, isEmpty, isObject, isString, mapValues, partial } from 'lodash'
import { createAction as actionCreate, getPayload } from 'cape-redux'

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

export function getMeta(prefixRaw, payload, extraMeta) {
  const prefix = getPrefix(prefixRaw)
  return isObject(extraMeta) ? { ...extraMeta, prefix } : { prefix }
}
export function preventDefault(event) {
  if (event && event.preventDefault) event.preventDefault()
}
export function createPayload(prefix, payload) {
  if (!payload) return payload
  preventDefault(payload)
  if (payload.target && payload.nativeEvent) {
    return payload.target.value || ''
  }
  return getPayload(payload)
}
export function createAction(type, hasPayload = true) {
  return actionCreate(type, hasPayload ? createPayload : noop, getMeta)
}
export function getProgress(value) {
  if (isObject(value) && value.loaded && value.total) {
    return parseInt((value.loaded / value.total) * 100, 10)
  }
  return parseInt(value, 10)
}
export const mapPartial = curry((obj, arg0) => mapValues(obj, func => partial(func, arg0)))
