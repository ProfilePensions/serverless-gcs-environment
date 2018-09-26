'use strict'

const sinon = require('sinon')
const Storage = require('../../src/lib/storage')

describe('gcs environment variales', () => {
  let sandbox
  let storage

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    storage = new Storage()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('storage', () => {
    it('should return base64 encoded values', async () => {
      sandbox.stub(storage.storage, 'bucket')
      const downloadStub = sandbox.stub()
      downloadStub.onCall(0).returns(['hello world'])
      storage.storage.bucket.returns({
        file: () => {
          return {
            download: downloadStub
          }
        }
      })
      const uri = 'gc:bucket-name/key'
      const expected = 'aGVsbG8gd29ybGQ='
      const result = await storage.downloadAsBase64(uri)
      expect(result).toEqual(expected)
    })
  })
})
