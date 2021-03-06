import { combineReducers } from 'redux'
import { routerReducer as routing} from 'react-router-redux'
import form from 'features/form/reducers'
import accessControl from 'features/accessControl/reducers'
import { reducers as account } from 'features/accounts'
import { reducers as app } from 'features/app'
import { reducers as asset } from 'features/assets'
import { reducers as balance } from 'features/balances'
import { reducers as core } from 'features/core'
import { reducers as federation } from 'features/federation'
import { reducers as initialization } from 'features/initialization'
import { reducers as mockhsm } from 'features/mockhsm'
import { reducers as testnet } from 'features/testnet'
import { reducers as transaction } from 'features/transactions'
import { reducers as transactionFeed } from 'features/transactionFeeds'
import { reducers as tutorial } from 'features/tutorial'
import { reducers as unspent } from 'features/unspents'
import { reducers as peer } from 'features/peers'
import { clear as clearStorage } from 'utility/localStorage'

const makeRootReducer = () => (state, action) => {
  if (action.type == 'UPDATE_CORE_INFO' &&
      !action.param.isConfigured) {
    // const newState = {
    //   form: state.form,
    //   routing: state.routing,
    // }
    //
    // if (state.core.blockchainId == (action.param.blockchainId || 0)) {
    //   newState.core = state.core
    // }
    //
    // state = newState
  } else if (action.type == 'USER_LOG_OUT') {
    // TODO: see if we can't move this outside of a reducer..

    // Actions still may fire after the location redirect, so make sure they
    // fire against blank state, and the local storage listener doesn't
    // persist state.
    state = undefined

    // Clear tokens and other state from local storage.
    clearStorage()

    // Finally, reboot the entire dashboard app via a hard redirect.
    window.location.href = '/'
  }

  return combineReducers({
    accessControl,
    account,
    app,
    asset,
    balance,
    core,
    form,
    federation,
    initialization,
    key: mockhsm,
    routing,
    peer,
    testnet,
    transaction,
    transactionFeed,
    tutorial,
    unspent,
  })(state, action)
}
export default makeRootReducer
