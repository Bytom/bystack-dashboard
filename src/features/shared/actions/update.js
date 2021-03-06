import { chainClient } from 'utility/environment'
import { push } from 'react-router-redux'
import actions from 'actions'

export default function(type, options = {}) {
  const updated = (param) => ({ type: `UPDATED_${type.toUpperCase()}`, param })

  return {
    updated,
    submitUpdateForm: (data, id, isCurrentAccount) => {
      const clientApi = options.clientApi ? options.clientApi() : chainClient()[`${type}s`]
      let promise = Promise.resolve()
      if (typeof data.alias == 'string')  data.alias = data.alias.trim()

      return function(dispatch) {
        return promise.then(() => clientApi.updateAlias({
          id: id,
          alias: data.alias,
        }).then((resp) => {
          if (resp.status === 'fail') {
            throw resp
          }

          if(type === 'account' && isCurrentAccount){
            dispatch(actions.account.switchAccount(data.alias))
          }
          dispatch(updated(resp))

          dispatch(push({
            pathname: `/${type}s/${id}`,
            state: {
              preserveFlash: true
            }
          }))
        }))
      }
    }
  }
}
