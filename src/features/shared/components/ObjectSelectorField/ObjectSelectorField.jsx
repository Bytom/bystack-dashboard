import React from 'react'
import styles from './ObjectSelectorField.scss'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { FieldLabel } from 'features/shared/components'
import {withNamespaces} from 'react-i18next'

const ALIAS_SELECTED = 'Alias'
const ID_SELECTED = 'ID'

class ObjectSelectorField extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showDropdown: false,
      selected: props.selected || ALIAS_SELECTED
    }

    this.select = this.select.bind(this)
    this.toggleDropwdown = this.toggleDropwdown.bind(this)
    this.closeDropdown = this.closeDropdown.bind(this)
  }

  toggleDropwdown() {
    this.setState({ showDropdown: !this.state.showDropdown })
  }

  closeDropdown() {
    this.setState({ showDropdown: false })
  }

  select(value) {
    this.setState({ selected: value })
    this.closeDropdown()
  }

  componentDidUpdate(prevProps) {
    if (this.props.selected !== prevProps.selected) {
      this.setState({
        selected: this.props.selected
      })
    }
  }

  render() {
    const idOnChange = (event) => {
      this.props.fieldProps.id.onChange(event.target.value)
      this.props.fieldProps.alias.onChange('')
    }

    const aliasOnChange = value => {
      this.props.fieldProps.alias.onChange(value)
      this.props.fieldProps.id.onChange('')
    }

    const t = this.props.t
    const alias_title = t('form.alias')

    const idProps = Object.assign({...this.props.fieldProps.id}, {onChange: idOnChange})
    const aliasProps = Object.assign({...this.props.fieldProps.alias}, {onChange: aliasOnChange})



    return(
      <div className='form-group'>
        {this.props.title && <FieldLabel>{this.props.title}</FieldLabel>}
        <div className='input-group'>
          <div className={`input-group-btn ${styles.btn} ${this.state.showDropdown && 'open'}`}>
            <DropdownButton
              className={styles.dropdownButton}
              id={ this.props.keyIndex? `input-dropdown-addon-${this.props.keyIndex}` : 'input-dropdown-addon' }
              title={(this.state.selected === ALIAS_SELECTED)? alias_title: this.state.selected}
              onSelect={this.select}
            >
              <MenuItem eventKey={ALIAS_SELECTED}>{ t('form.alias') }</MenuItem>
              <MenuItem eventKey={ID_SELECTED}>ID</MenuItem>
            </DropdownButton>
          </div>

          {this.state.selected == ID_SELECTED &&
            <input className='form-control'
              type={this.state.type}
              disabled={this.props.disabled}
              placeholder={`${this.props.title} ID`}
              {...idProps} />}

          {this.state.selected == ALIAS_SELECTED &&
            <this.props.aliasField
              className={styles.aliasFieldGroupItem}
              disabled={this.props.disabled}
              placeholder={  t('form.objectField.aliasPlaceholder' , {title: this.props.title.toLowerCase()}) }
              fieldProps={aliasProps} />}

        </div>
        {this.props.hint && <span className='help-block'>{this.props.hint}</span>}
      </div>
    )
  }
}

export default withNamespaces('translations') (ObjectSelectorField)
