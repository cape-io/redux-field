import noop from 'lodash/noop'
import _createAction, { payloadCreatorDefault } from './createAction'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'

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

export function getMeta(prefix) {
  return { prefix: getPrefix(prefix) }
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
