import isEmpty from 'lodash/isEmpty'

export function isRequired(value) {
  if (isEmpty(value)) {
    return 'Required'
  }
}
