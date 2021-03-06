import React from 'react'
import { connect } from 'react-redux'
import { Flash } from 'features/shared/components'
import { Link } from 'react-router'
import { humanize, capitalize } from 'utility/string'
import { Affix } from 'react-overlays'
import makeRoutes from 'routes'
import actions from 'actions'
import styles from './PageTitle.scss'
import componentClassNames from 'utility/componentClassNames'
import { withNamespaces } from 'react-i18next'

class PageTitle extends React.Component {
  render() {
    const chevron = require('images/chevron.png')

    return (
      <div className={componentClassNames(this)}>
        <div className={`${styles.main} navbar`}>
          <div className={styles.navigation}>
            {this.props.breadcrumbs.length > 1 && (
              <Link className={styles.back} to={'/' + this.props.breadcrumbs[0].path}>
                <img src={require('images/back.png')} />
              </Link>
            )}
            <span className={styles.title}>{this.props.title}</span>
            {this.props.extraHeader}
            {/* <ul className={styles.crumbs}>
              {this.props.breadcrumbs.map(crumb =>
                <li className={styles.crumb} key={crumb.name}>
                  {!crumb.last && <Link to={'/' + crumb.path}>
                    {capitalize(crumb.name)}
                    <img src={chevron} className={styles.chevron} />
                  </Link>}

                  {crumb.last && <span className={styles.title}>
                    {this.props.title || crumb.name}
                  </span>}
                </li>
              )}
            </ul> */}
          </div>

          {Array.isArray(this.props.actions) && (
            <ul className={styles.actions}>
              {this.props.actions.map((item) => (
                <li key={item.key}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        <Affix affixClassName={styles.flash} affixStyle={{ top: '90px' }}>
          <div>
            <Flash
              messages={this.props.flashMessages}
              markFlashDisplayed={this.props.markFlashDisplayed}
              dismissFlash={this.props.dismissFlash}
            />
          </div>
        </Affix>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const routes = makeRoutes()
  const pathname = state.routing.locationBeforeTransitions.pathname
  const breadcrumbs = []

  let currentRoutes = routes.childRoutes
  let currentPath = []
  pathname.split('/').forEach((component) => {
    let match = currentRoutes.find((route) => {
      return route.path == component || route.path.indexOf(':') >= 0
    })

    if (match) {
      currentRoutes = match.childRoutes || []
      currentPath.push(component)

      if (!match.skipBreadcrumb) {
        breadcrumbs.push({
          name: ownProps.t(`crumbName.${match.name}`) || humanize(component),
          path: currentPath.join('/'),
        })
      }
    }
  })

  breadcrumbs[breadcrumbs.length - 1].last = true

  return {
    breadcrumbs,
    flashMessages: state.app.flashMessages,
  }
}

export default withNamespaces('translations')(
  connect(mapStateToProps, (dispatch) => ({
    markFlashDisplayed: (key) => dispatch(actions.app.displayedFlash(key)),
    dismissFlash: (key) => dispatch(actions.app.dismissFlash(key)),
  }))(PageTitle),
)
