'use strict'

const sinon = require('sinon')
const ServerlessGcsEnvironmentPlugin = require('../src/index.js')

describe('gcs environment variales', () => {
  let serverless
  let pluginInstance
  let expectedEnvVarsProvider
  let expectedEnvVarsFunction
  let sandbox

  beforeEach(() => {
    serverless = {
      service: {
        provider: {
          environment: {
            GCS_VAR: 'gcs::bucket/encrypted1.env' // eslint-disable-line
          }
        },
        functions: {
          testFn: {
            environment: {
              GCS_VAR_FN: 'gcs::bucket/encrypted2.env' // eslint-disable-line
            }
          }
        }
      },
      cli: {
        log: jest.fn()
      },
      config: {
        servicePath: '/tmp/ServerlessGcsEnvironmentPlugin/'
      }
    }

    sandbox = sinon.createSandbox()
    expectedEnvVarsProvider = {
      GCS_VAR: 'aGVsbG8gd29ybGQ='
    }
    expectedEnvVarsFunction = {
      GCS_VAR_FN: 'cHJvZmlsZSBwZW5zaW9ucw=='
    }

    pluginInstance = new ServerlessGcsEnvironmentPlugin(serverless, {})
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('gcs env', () => {
    it('should get gcs env', async () => {
      sandbox.stub(pluginInstance.storage, 'downloadAsBase64')
      pluginInstance.storage.downloadAsBase64
        .onCall(0).returns('aGVsbG8gd29ybGQ=')
        .onCall(1).returns('cHJvZmlsZSBwZW5zaW9ucw==')
      await pluginInstance.gcsSecretsHandler()

      expect(serverless.service.provider.environment).toEqual(expectedEnvVarsProvider)
      expect(serverless.service.functions.testFn.environment).toEqual(expectedEnvVarsFunction)
    })
  })
})
