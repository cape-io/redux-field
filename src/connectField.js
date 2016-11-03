import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getActions, getPrefix, getState } from './index'

export function mapStateToProps(state, ownProps) {
  return {
    form: getState(state, ownProps),
  }
}
export function mapDispatchToProps(dispatch, ownProps) {
  const prefix = getPrefix(ownProps.prefix)
  const { fieldEvent, formEvent, formHandler } = getActions(prefix)
  return {
    fieldEvent: bindActionCreators(fieldEvent, dispatch),
    formEvent: bindActionCreators(formEvent, dispatch),
    formHandler: bindActionCreators(formHandler, dispatch),
  }
}
// This gets state and actions for a specific field. That is all.
// The prefix can be sent via init option or with props on each instance.
export default function connectField(options = {}) {
  // Pass in a component and it will get connected for you.
  return (Component) => {
    const mapProps = (state, props) =>
      mapStateToProps(state, { ...options, ...props })
    const mapDispatch = (dispatch, props) =>
      mapDispatchToProps(dispatch, { ...options, ...props })
    return connect(mapProps, mapDispatch)(Component)
  }
}
