'use strict'

const Storage = require('./lib/storage')

const collectFunctionEnvVariables = require('./lib/collectFunctionEnvVariables.js')
const collectProviderEnvVariables = require('./lib/collectProviderEnvVariables')

class ServerlessGcsEnvironmentPlugin {
  constructor (serverless, options) {
    this.serverless = serverless
    this.options = options
    this.gcsRegex = /(gcs::)(.*)/
    this.storage = new Storage()

    this.hooks = {
      'before:package:finalize': this.gcsSecretsHandler.bind(this)
    }

    this.environmentVariables = {}
  }

  async gcsSecretsHandler () {
    this.serverless.cli.log('Creating .env file...')

    // collect global environment variables
    this.environmentVariables.provider = collectProviderEnvVariables(this.serverless)

    // collect environment variables of functions
    this.environmentVariables.functions = collectFunctionEnvVariables(this.serverless)

    for (const type in this.environmentVariables) {
      for (const key in this.environmentVariables[type]) {
        const envVar = this.environmentVariables[type][key]
        if (typeof envVar.environment === 'object') {
          // Function environment
          for (const subKey in envVar.environment) {
            const gcsUri = envVar.environment[subKey].match(this.gcsRegex)
            if (!gcsUri) { return }
            this.serverless.service[type][key].environment[subKey] = await this.storage.downloadAsBase64(gcsUri)
          }
        } else {
          // Provider environment
          const gcsUri = envVar.environment.match(this.gcsRegex)
          if (!gcsUri) { return }
          this.serverless.service[type].environment[key] = await this.storage.downloadAsBase64(gcsUri)
        }
      }
    }
  }
}

module.exports = ServerlessGcsEnvironmentPlugin
