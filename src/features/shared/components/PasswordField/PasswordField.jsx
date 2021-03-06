import React from 'react'
import pick from 'lodash/pick'
import styles from './PasswordField.scss'
import { FieldLabel } from 'features/shared/components'
import disableAutocomplete from 'utility/disableAutocomplete'

const TEXT_FIELD_PROPS = [
  'value',
  'onBlur',
  'onChange',
  'onFocus',
  'name'
]

class PasswordField extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      capLock: false
    }
  }

  render() {
    const fieldProps = pick(this.props.fieldProps, TEXT_FIELD_PROPS)
    const {touched, error} = this.props.fieldProps

    const capLock = (e) => {
      if (e.getModifierState('CapsLock')) {
        this.setState({capLock: true})
      } else {
        this.setState({capLock: false})
      }
    }

    return(
      <div className='form-group'>
        {this.props.title && <FieldLabel>{this.props.title}</FieldLabel>}
        <input className={`form-control ${styles.password} ${fieldProps.value? styles.dotFont: null}
         ${this.state.capLock? styles.capsIconGreen: styles.capsIcon}`}
          type='text'
          placeholder={this.props.placeholder}
          autoFocus={!!this.props.autoFocus}
          onKeyUp={capLock}
          {...disableAutocomplete}
          {...fieldProps} />

        {touched && error && <span className='text-danger'><strong>{error}</strong></span>}
        {this.props.hint && <span className='help-block'>{this.props.hint}</span>}
      </div>
    )
  }
}

export default PasswordField
