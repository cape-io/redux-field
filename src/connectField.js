import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import get from 'lodash/get'
import isString from 'lodash/isString'

import { getActions, getState, selectForm } from './index'

export function getInfo(props) {
  const { prefix } = props
  return {
    prefix: isString(prefix) ? prefix.split('.') : prefix || [ 'default' ],
    selectForm: props.selectForm || selectForm,
    validate: get(props, [ 'field', 'validate' ], props.validate),
  }
}
export function mapStateToProps(state, ownProps) {
  const { initialValue, prefix, validate } = getInfo(ownProps)
  return {
    form: getState(ownProps.selectForm(state), prefix, validate, initialValue),
  }
}
export function mapDispatchToProps(dispatch, ownProps) {
  const { prefix } = getInfo(ownProps)
  const { fieldEvent, formEvent, formHandler } = getActions(prefix)
  return {
    fieldEvent: bindActionCreators(fieldEvent, dispatch),
    formEvent: bindActionCreators(formEvent, dispatch),
    formHandler: bindActionCreators(formHandler, dispatch),
  }
}
// This gets state and actions for a specific field. That is all.
// The prefix can be sent via init option or with props on each instance.
export default function connectField(options) {
  // Pass in a component and it will get connected for you.
  return Component => {
    const mapProps = (state, props) =>
      mapStateToProps(state, { ...options, ...props })
    const mapDispatch = (dispatch, props) =>
      mapDispatchToProps(dispatch, { ...options, ...props })
    return connect(mapProps, mapDispatch)(Component)
  }
}
