import { chainClient } from 'utility/environment'
import { actions as coreActions } from 'features/core'
import { fetchTestnetInfo } from 'features/testnet/actions'

const retry = (dispatch, promise, count = 10) => {
  return dispatch(promise).catch((err) => {
    var currentTime = new Date().getTime()
    while (currentTime + 200 >= new Date().getTime()) { /* wait for retry */ }

    if (count >= 1) {
      retry(dispatch, promise, count - 1)
    } else {
      throw(err)
    }
  })
}

let actions = {
  submitConfiguration: (data) => {
    // copy from bytom-electron
    if (process.env.TARGET === 'electron') {
      if (data.type == 'testnet'){
        window.ipcRenderer.send('bytomdInitNetwork','testnet')
      }else if(data.type == 'mainnet'){
        window.ipcRenderer.send('bytomdInitNetwork','mainnet')
      }else if(data.type == 'solonet'){
        window.ipcRenderer.send('bytomdInitNetwork','solonet')
      }
      return (dispatch) => (dispatch)
    }

    const configureWithRetry = (dispatch, config) => {
      return chainClient().config.configure(config)
        .then(() => retry(dispatch, coreActions.fetchCoreInfo({throw: true})))
    }

    return (dispatch) => {
      if (data.type == 'testnet') {
        return dispatch(fetchTestnetInfo()).then(testnet =>
          configureWithRetry(dispatch, testnet))
      } else {
        if (data.type == 'new') {
          data = {
            isGenerator: true,
            isSigner: true,
            quorum: 1,
          }
        }

        delete data.type
        return configureWithRetry(dispatch, data)
      }
    }
  }
}

export default actions
