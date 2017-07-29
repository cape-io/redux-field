import { curry, has, noop, isArray, isEmpty, isObject, isString, mapValues, partial } from 'lodash'
import { createAction as actionCreate, getPayload } from 'cape-redux'

export const PREFIX = 'default'

export function createPrefix(prefix) {
  if (isString(prefix)) {
    return prefix.split('.')
  }
  if (isArray(prefix) && !isEmpty(prefix)) {
    return prefix
  }
  if (isObject(prefix) && prefix.fieldId && prefix.formId) {
    return [prefix.formId, prefix.fieldId]
  }
  return [PREFIX]
}

export function getMeta(prefixRaw, payload, extraMeta) {
  const prefix = createPrefix(prefixRaw)
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
export function roundNumber(progress, total) {
  return parseInt((progress / total) * 100, 10)
}
export function getProgress(value) {
  if (isObject(value)) {
    const hasProp = partial(has, value)
    if (hasProp('loaded') && hasProp('total')) return roundNumber(value.loaded, value.total)
    if (hasProp('bytesTransferred') && hasProp('totalBytes')) {
      return roundNumber(value.bytesTransferred, value.totalBytes)
    }
  }
  return parseInt(value, 10)
}
export const mapPartial = curry((obj, arg0) => mapValues(obj, func => partial(func, arg0)))
