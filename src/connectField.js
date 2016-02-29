import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import get from 'lodash/get'
import isString from 'lodash/isString'

import { getActions, getState, selectForm } from './index'

export function mapStateToProps(state, ownProps) {
  const { initialValue, prefix, selectFormState, validate } = ownProps
  return {
    form: getState(selectFormState(state), prefix, validate, initialValue),
  }
}
export function mapDispatchToProps(dispatch, { prefix }) {
  const { fieldEvent, formEvent, formHandler } = getActions(prefix)
  return {
    fieldEvent: bindActionCreators(fieldEvent, dispatch),
    formEvent: bindActionCreators(formEvent, dispatch),
    formHandler: bindActionCreators(formHandler, dispatch),
  }
}
export function getInfo(ownProps, options = {}) {
  const prefix = ownProps.prefix || options.prefix || [ 'default' ]
  return {
    prefix: isString(prefix) ? prefix.split('.') : prefix,
    selectFormState: options.selectForm || selectForm,
    validate: get(ownProps, [ 'field', 'validate' ], options.validate),
  }
}
// This gets state and actions for a specific field. That is all.
// The prefix can be sent via init option or with props on each instance.
export default function connectField(options) {
  // Pass in a component and it will get connected for you.
  return Component => {
    const mapProps = (state, props) =>
      mapStateToProps(state, getInfo(props, options))
    const mapDispatch = (dispatch, props) =>
      mapDispatchToProps(dispatch, getInfo(props, options))
    return connect(mapProps, mapDispatch)(Component)
  }
}
