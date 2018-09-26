'use strict'

function collectProviderEnvVariables (serverless) {
  const providerEnv = serverless.service.provider.environment || {}
  let environmentVariables = {}

  Object.keys(providerEnv).forEach(func => {
    const environment = providerEnv[func]
    environmentVariables[func] = { type: 'provider', environment }
  })

  return environmentVariables
}

module.exports = collectProviderEnvVariables
