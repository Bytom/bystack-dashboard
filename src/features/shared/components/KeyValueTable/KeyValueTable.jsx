import React from 'react'
import styles from './KeyValueTable.scss'
import tableStyles from '../TableList/TableList.scss'
import {Section} from 'features/shared/components'
import {Link} from 'react-router'
import {size, sample, isArray, isObject, toPairs} from 'lodash'
import { copyToClipboard } from 'utility/clipboard'
import {withNamespaces} from 'react-i18next'

class KeyValueTable extends React.Component {
  shouldUsePre(item) {
    if (item.pre) return true

    return item.value != null && (typeof item.value == 'object')
  }

  stringify(value) {
    if (isObject(value) && size(value) == 1) {
      // Random sample will always be the lone value here
      let sampled = sample(value)

      if (!isObject(sampled)) {
        if (isArray(value)) return JSON.stringify(value)

        // Manually construct single-key object stringify for better formatting
        const pair = toPairs(value)[0]
        return `{${JSON.stringify(pair[0])}: ${JSON.stringify(pair[1])}}`
      }
    }

    return JSON.stringify(value, null, '  ')
  }

  renderValue(item) {
    let value = item.value
    if (this.shouldUsePre(item)) {
      value = <pre className={styles.pre}>{this.stringify(item.value)}</pre>
    }
    if (item.link) {
      value = <Link to={item.link}>{value}</Link>
    }

    if (value === undefined || value === null || value === '') {
      value = '-'
    }

    return value
  }

  render() {
    const t = this.props.t
    const border = this.props.border !== false
    return <Section
      title={this.props.title}
      actions={this.props.actions}>
      <table className={`${styles.table} ${border ? styles.border : null}`}>
        <tbody>
          {this.props.items.map((item) => {
            return <tr key={item.label}>
              <td className={styles.label}>{item.label}</td>
              <td className={styles.value}>{this.renderValue(item)}
                {item.copy &&  <button
                  className={`btn btn-link btn-icon ${styles.copyButton}`}
                  onClick={() => copyToClipboard(this.renderValue(item))}
                >
                  <img src={require('images/copy.svg')}/>
                </button>}
                {item.note}
                {item.editUrl && <Link to={item.editUrl} className={styles.edit}>
                  <span
                    className={`${styles.pencil} glyphicon glyphicon-pencil`}></span>{t('form.edit')}
                </Link>}
                {item.details && <Link className={`${styles.edit} ${tableStyles.link}`} to={item.details}>
                  {t('form.detail')}
                </Link>}
                {item.program &&
              <button onClick={item.program} className={`${styles.detail} ${styles.edit} btn btn-link`}>
                {t('commonWords.program')}
              </button>}
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </Section>
  }
}

export default  withNamespaces('translations') (KeyValueTable)
