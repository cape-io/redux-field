import noop from 'lodash/noop'
import _createAction, { payloadCreatorDefault } from './createAction'

export function getMeta(payload, ...args) {
  return { prefix: args }
}
export function getPayload(payload) {
  if (!payload) return payload
  if (payload.target && payload.nativeEvent) {
    return payload.target.value || ''
  }
  return payloadCreatorDefault(payload)
}
export function createAction(type, hasPayload = true) {
  return _createAction(type, hasPayload ? getPayload : noop, getMeta)
}
