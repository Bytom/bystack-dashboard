import React from 'react'
import styles from './Loading.scss'
import componentClassNames from 'utility/componentClassNames'

class Loading extends React.Component {
  render() {
    return (
      <div className={componentClassNames(this, styles.main)}>
        <img src={require('images/Logo-Bystack.png')} className={styles.logo} />
        {this.props.children}
      </div>
    )
  }
}

export default Loading
