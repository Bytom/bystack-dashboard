const shared = require('../shared')

const accountsAPI = (client) => {
  return {
    create: (params, cb) => shared.create(client, '/create-account', params, {cb, skipArray: true}),

    createBatch: (params, cb) => shared.createBatch(client, '/create-account', params, {cb}),

    updateTags: (params, cb) => {
      return shared.singletonBatchRequest(client, '/update-account-tags', {
        account_info: params.id,
        tags: params.tags
      }, cb)
    },

    updateTagsBatch: (params, cb) => shared.batchRequest(client, '/update-account-tags', params, cb),

    updateAlias: (params, cb) => {
      const finalParams = {
        account_id: params.id,
        new_alias: params.alias
      }
      return shared.singletonBatchRequest(client, '/update-account-alias', finalParams, cb)
    },

    query: (params, cb) => shared.query(client, 'accounts', '/list-accounts', params, {cb}),

    queryAll: (params, processor, cb) => shared.queryAll(client, 'accounts', params, processor, cb),

    createReceiver: (params, cb) => shared.create(client, '/create-account-receiver', params, {cb, skipArray: true}),

    createAddress: (params, cb) => shared.create(client, '/create-account-receiver', params, {cb, skipArray: true}),

    createReceiverBatch: (params, cb) => shared.createBatch(client, '/create-account-receiver', params, {cb}),

    listAddresses: (params) => shared.query(client, 'accounts', '/list-addresses', params),

    validateAddresses: (address, cb) => shared.query(client, 'accounts', '/validate-address', {'address': address},  {cb}),

    listAccountVotes: (params, cb) => shared.query(client, 'accounts', '/list-account-votes', params, {cb}),
    // listAccountVotes: (params, cb) => shared.query(client, 'accounts', '/get-vote-result', params, {cb}),
  }
}

module.exports = accountsAPI
