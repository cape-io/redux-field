import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import forEach from 'lodash/forEach'
import set from 'lodash/set'

import { getActions, getPrefix, getState } from './index'

export function mapStateToProps(state, ownProps) {
  const form = {}
  forEach(ownProps.fields, field => {
    set(form, field.prefix, getState(state, field))
  })
  return { form }
}
export function fieldDispatchToProps(dispatch, ownProps) {
  const events = {
    fieldEvent: {},
    formEvent: {},
    formHandler: {},
  }
  forEach(ownProps.fields, field => {
    const { fieldEvent, formEvent, formHandler } = getActions(field.prefix)
    set(events.fieldEvent, field.prefix, bindActionCreators(fieldEvent, dispatch))
    set(events.formEvent, field.prefix, bindActionCreators(formEvent, dispatch))
    set(events.formHandler, field.prefix, bindActionCreators(formHandler, dispatch))
  })
  return events
}
export function mapDispatchToProps(dispatch, ownProps) {

}

// This gets state and actions for a specific field. That is all.
// The prefix can be sent via init option or with props on each instance.
export default function connectField(options = {}) {
  // Pass in a component and it will get connected for you.
  return Component => {
    const mapProps = (state, props) =>
      mapStateToProps(state, { ...options, ...props })
    const mapDispatch = (dispatch, props) =>
      mapDispatchToProps(dispatch, { ...options, ...props })
    return connect(mapProps, mapDispatch)(Component)
  }
}
