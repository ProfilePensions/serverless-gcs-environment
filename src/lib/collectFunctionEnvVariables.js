'use strict'

function collectFunctionEnvVariables (serverless) {
  const functions = serverless.service.functions || {}
  let environmentVariables = {}

  Object.keys(functions).forEach(func => {
    const environment = functions[func].environment
    if (!environment) return

    environmentVariables[func] = { type: 'functions', environment }
  })

  return environmentVariables
}

module.exports = collectFunctionEnvVariables
